"""
Import Bambu Lab Materials from CSV

This script imports the complete Bambu filament catalog into FilaOps.
Run from the backend directory with venv activated:

    python scripts/import_bambu_materials.py

CSV Format Expected:
    Category, SKU, Name, Material Type, Material Color Name, HEX Code, Unit, Status, Price/kg, On Hand (g)
"""
import sys
import os
from decimal import Decimal

# Add parent to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.settings import settings

# Material densities (g/cm³) - standard values for filament types
MATERIAL_DENSITIES = {
    'PLA': Decimal('1.24'),
    'PETG': Decimal('1.27'),
    'ABS': Decimal('1.04'),
    'ASA': Decimal('1.07'),
    'TPU': Decimal('1.21'),
}

def get_base_material(material_type_code: str) -> str:
    """Extract base material from type code like PLA_MATTE -> PLA"""
    code_upper = material_type_code.upper()
    for base in ['PLA', 'PETG', 'ABS', 'ASA', 'TPU']:
        if code_upper.startswith(base):
            return base
    return 'PLA'

# The CSV data - embedded directly
CSV_DATA = """Category,SKU,Name,Material Type,Material Color Name,HEX Code,Unit,Status,Price/kg,On Hand (g)
PLA Matte,MAT-FDM-PLA_MATTE-CHAR,PLA Matte Charcoal,PLA_MATTE,Charcoal,#000000,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-DKRED,PLA Matte Dark Red,PLA_MATTE,Dark Red,#BB3D43,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-ASHGRY,PLA Matte Ash Grey,PLA_MATTE,Ash Grey,#9B9EA0,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-IVWHT,PLA Matte Ivory White,PLA_MATTE,Ivory White,#FFFFFF,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-DKBLU,PLA Matte Dark Blue,PLA_MATTE,Dark Blue,#042F56,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-DKBRN,PLA Matte Dark Brown,PLA_MATTE,Dark Brown,#7D6556,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-LATBRN,PLA Matte Latte Brown,PLA_MATTE,Latte Brown,#D3B7A7,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-SAKPNK,PLA Matte Sakura Pink,PLA_MATTE,Sakura Pink,#E8AFCF,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-LEMYEL,PLA Matte Lemon Yellow,PLA_MATTE,Lemon Yellow,#F7D959,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-DKGRN,PLA Matte Dark Green,PLA_MATTE,Dark Green,#68724D,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-MNDORG,PLA Matte Mandarin Orange,PLA_MATTE,Mandarin Orange,#F99963,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-GRSGRN,PLA Matte Grass Green,PLA_MATTE,Grass Green,#61C680,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-DESTAN,PLA Matte Desert Tan,PLA_MATTE,Desert Tan,#E8DBB7,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-ICEBLU,PLA Matte Ice Blue,PLA_MATTE,Ice Blue,#A3D8E1,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-LILPUR,PLA Matte Lilac Purple,PLA_MATTE,Lilac Purple,#AE96D4,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-MARBLU,PLA Matte Marine Blue,PLA_MATTE,Marine Blue,#0078BF,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-SCARED,PLA Matte Scarlet Red,PLA_MATTE,Scarlet Red,#DE4343,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-BNWHT,PLA Matte Bone White,PLA_MATTE,Bone White,#CBC6B8,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-CARM,PLA Matte Caramel,PLA_MATTE,Caramel,#AE835B,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-TERRA,PLA Matte Terracotta,PLA_MATTE,Terracotta,#B15533,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-DKCHOC,PLA Matte Dark Chocolate,PLA_MATTE,Dark Chocolate,#4D3324,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-PLUM,PLA Matte Plum,PLA_MATTE,Plum,#950051,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-APPGRN,PLA Matte Apple Green,PLA_MATTE,Apple Green,#C2E189,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-SKYBLU,PLA Matte Sky Blue,PLA_MATTE,Sky Blue,#56B7E6,kg,Active,19.99,0
PLA Matte,MAT-FDM-PLA_MATTE-NRDGRY,PLA Matte Nardo Gray,PLA_MATTE,Nardo Gray,#757575,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-JADWHT,PLA Basic Jade White,PLA_BASIC,Jade White,#FFFFFF,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-MAG,PLA Basic Magenta,PLA_BASIC,Magenta,#EC008C,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-GLD,PLA Basic Gold,PLA_BASIC,Gold,#E4BD68,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-MSTGRN,PLA Basic Mistletoe Green,PLA_BASIC,Mistletoe Green,#3F8E43,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-RED,PLA Basic Red,PLA_BASIC,Red,#C12E1F,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-BEIGE,PLA Basic Beige,PLA_BASIC,Beige,#F7E6DE,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-PNK,PLA Basic Pink,PLA_BASIC,Pink,#F55A74,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-SUNYEL,PLA Basic Sunflower Yellow,PLA_BASIC,Sunflower Yellow,#FEC600,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-BRNZ,PLA Basic Bronze,PLA_BASIC,Bronze,#847D48,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-LTGRY,PLA Basic Light Gray,PLA_BASIC,Light Gray,#D1D3D5,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-HTPNK,PLA Basic Hot Pink,PLA_BASIC,Hot Pink,#F5547C,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-YEL,PLA Basic Yellow,PLA_BASIC,Yellow,#F4EE2A,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-SLV,PLA Basic Silver,PLA_BASIC,Silver,#A6A9AA,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-ORG,PLA Basic Orange,PLA_BASIC,Orange,#FF6A13,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-GRY,PLA Basic Gray,PLA_BASIC,Gray,#8E9089,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-PMPORG,PLA Basic Pumpkin Orange,PLA_BASIC,Pumpkin Orange,#FF9016,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-BRTGRN,PLA Basic Bright Green,PLA_BASIC,Bright Green,#BECF00,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-COCBRN,PLA Basic Cocoa Brown,PLA_BASIC,Cocoa Brown,#6F5034,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-TURQ,PLA Basic Turquoise,PLA_BASIC,Turquoise,#00B1B7,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-PUR,PLA Basic Purple,PLA_BASIC,Purple,#5E43B7,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-INDPUR,PLA Basic Indigo Purple,PLA_BASIC,Indigo Purple,#482960,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-CYN,PLA Basic Cyan,PLA_BASIC,Cyan,#0086D6,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-BLUGRY,PLA Basic Blue Grey,PLA_BASIC,Blue Grey,#5B6579,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-BRN,PLA Basic Brown,PLA_BASIC,Brown,#9D432C,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-BLU,PLA Basic Blue,PLA_BASIC,Blue,#0A2989,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-DKGRY,PLA Basic Dark Gray,PLA_BASIC,Dark Gray,#545454,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-BAMGRN,PLA Basic Bambu Green,PLA_BASIC,Bambu Green,#00AE42,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-MARRED,PLA Basic Maroon Red,PLA_BASIC,Maroon Red,#9D2235,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-COBBLU,PLA Basic Cobalt Blue,PLA_BASIC,Cobalt Blue,#0056B8,kg,Active,19.99,0
PLA Basic,MAT-FDM-PLA_BASIC-BLK,PLA Basic Black,PLA_BASIC,Black,#000000,kg,Active,19.99,0
PLA Silk,MAT-FDM-PLA_SILK-GLD,PLA Silk Gold,PLA_SILK,Gold,#F4A925,kg,Active,22.99,0
PLA Silk,MAT-FDM-PLA_SILK-SLV,PLA Silk Silver,PLA_SILK,Silver,#C8C8C8,kg,Active,22.99,0
PLA Silk,MAT-FDM-PLA_SILK-TITGRY,PLA Silk Titan Gray,PLA_SILK,Titan Gray,#5F6367,kg,Active,22.99,0
PLA Silk,MAT-FDM-PLA_SILK-BLU,PLA Silk Blue,PLA_SILK,Blue,#008BDA,kg,Active,22.99,0
PLA Silk,MAT-FDM-PLA_SILK-PUR,PLA Silk Purple,PLA_SILK,Purple,#8671CB,kg,Active,22.99,0
PLA Silk,MAT-FDM-PLA_SILK-CNDRED,PLA Silk Candy Red,PLA_SILK,Candy Red,#D02727,kg,Active,22.99,0
PLA Silk,MAT-FDM-PLA_SILK-CNDGRN,PLA Silk Candy Green,PLA_SILK,Candy Green,#018814,kg,Active,22.99,0
PLA Silk,MAT-FDM-PLA_SILK-RSGLD,PLA Silk Rose Gold,PLA_SILK,Rose Gold,#BA9594,kg,Active,22.99,0
PLA Silk,MAT-FDM-PLA_SILK-BBYBLU,PLA Silk Baby Blue,PLA_SILK,Baby Blue,#A8C6EE,kg,Active,22.99,0
PLA Silk,MAT-FDM-PLA_SILK-PNK,PLA Silk Pink,PLA_SILK,Pink,#F7ADA6,kg,Active,22.99,0
PLA Silk,MAT-FDM-PLA_SILK-MINT,PLA Silk Mint,PLA_SILK,Mint,#96DCB9,kg,Active,22.99,0
PLA Silk,MAT-FDM-PLA_SILK-CHAMP,PLA Silk Champagne,PLA_SILK,Champagne,#F3CFB2,kg,Active,22.99,0
PLA Silk,MAT-FDM-PLA_SILK-WHT,PLA Silk White,PLA_SILK,White,#FFFFFF,kg,Active,22.99,0
PLA Silk Multi,MAT-FDM-PLA_SILK_MULTI-MYSTMAG,PLA Silk Multi Mystic Magenta,PLA_SILK_MULTI,Mystic Magenta,#720062,kg,Active,22.49,0
PLA Silk Multi,MAT-FDM-PLA_SILK_MULTI-PHANBLU,PLA Silk Multi Phantom Blue,PLA_SILK_MULTI,Phantom Blue,#00629B,kg,Active,22.49,0
PLA Silk Multi,MAT-FDM-PLA_SILK_MULTI-VELECL,PLA Silk Multi Velvet Eclipse,PLA_SILK_MULTI,Velvet Eclipse,#000000,kg,Active,22.49,0
PLA Silk Multi,MAT-FDM-PLA_SILK_MULTI-MIDBLZ,PLA Silk Multi Midnight Blaze,PLA_SILK_MULTI,Midnight Blaze,#0047BB,kg,Active,22.49,0
PLA Silk Multi,MAT-FDM-PLA_SILK_MULTI-GLDROS,PLA Silk Multi Gilded Rose,PLA_SILK_MULTI,Gilded Rose,#FF9425,kg,Active,22.49,0
PLA Silk Multi,MAT-FDM-PLA_SILK_MULTI-BLUHAW,PLA Silk Multi Blue Hawaii,PLA_SILK_MULTI,Blue Hawaii,#60A4E8,kg,Active,22.49,0
PLA Silk Multi,MAT-FDM-PLA_SILK_MULTI-NEOCTY,PLA Silk Multi Neon City,PLA_SILK_MULTI,Neon City,#0047BB,kg,Active,22.49,0
PLA Silk Multi,MAT-FDM-PLA_SILK_MULTI-AURPUR,PLA Silk Multi Aurora Purple,PLA_SILK_MULTI,Aurora Purple,#7F3696,kg,Active,22.49,0
PLA Silk Multi,MAT-FDM-PLA_SILK_MULTI-SOBCH,PLA Silk Multi South Beach,PLA_SILK_MULTI,South Beach,#F772A4,kg,Active,22.49,0
PLA Silk Multi,MAT-FDM-PLA_SILK_MULTI-DWNRAD,PLA Silk Multi Dawn Radiance,PLA_SILK_MULTI,Dawn Radiance,#EC984C,kg,Active,22.49,0
PETG-HF,MAT-FDM-PETG_HF-YEL,PETG-HF Yellow,PETG_HF,Yellow,#FFD00B,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-ORG,PETG-HF Orange,PETG_HF,Orange,#F75403,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-GRN,PETG-HF Green,PETG_HF,Green,#00AE42,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-RED,PETG-HF Red,PETG_HF,Red,#EB3A3A,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-BLU,PETG-HF Blue,PETG_HF,Blue,#002E96,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-BLK,PETG-HF Black,PETG_HF,Black,#000000,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-WHT,PETG-HF White,PETG_HF,White,#FFFFFF,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-CRM,PETG-HF Cream,PETG_HF,Cream,#F9DFB9,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-LIMGRN,PETG-HF Lime Green,PETG_HF,Lime Green,#6EE53C,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-FORGRN,PETG-HF Forest Green,PETG_HF,Forest Green,#39541A,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-LAKBLU,PETG-HF Lake Blue,PETG_HF,Lake Blue,#1F79E5,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-PNTBRN,PETG-HF Peanut Brown,PETG_HF,Peanut Brown,#875718,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-GRY,PETG-HF Gray,PETG_HF,Gray,#ADB1B2,kg,Active,19.99,0
PETG-HF,MAT-FDM-PETG_HF-DKGRY,PETG-HF Dark Gray,PETG_HF,Dark Gray,#515151,kg,Active,19.99,0
PETG Translucent,MAT-FDM-PETG_TRANS-GRY,PETG Translucent Gray,PETG_TRANS,Translucent Gray,#8E8E8E,kg,Active,19.99,0
PETG Translucent,MAT-FDM-PETG_TRANS-LTBLU,PETG Translucent Light Blue,PETG_TRANS,Translucent Light Blue,#61B0FF,kg,Active,19.99,0
PETG Translucent,MAT-FDM-PETG_TRANS-OLV,PETG Translucent Olive,PETG_TRANS,Translucent Olive,#748C45,kg,Active,19.99,0
PETG Translucent,MAT-FDM-PETG_TRANS-BRN,PETG Translucent Brown,PETG_TRANS,Translucent Brown,#C9A381,kg,Active,19.99,0
PETG Translucent,MAT-FDM-PETG_TRANS-TEAL,PETG Translucent Teal,PETG_TRANS,Translucent Teal,#77EDD7,kg,Active,19.99,0
PETG Translucent,MAT-FDM-PETG_TRANS-ORG,PETG Translucent Orange,PETG_TRANS,Translucent Orange,#FF911A,kg,Active,19.99,0
PETG Translucent,MAT-FDM-PETG_TRANS-PUR,PETG Translucent Purple,PETG_TRANS,Translucent Purple,#D6ABFF,kg,Active,19.99,0
PETG Translucent,MAT-FDM-PETG_TRANS-PNK,PETG Translucent Pink,PETG_TRANS,Translucent Pink,#F9C1BD,kg,Active,19.99,0
PETG-CF,MAT-FDM-PETG_CF-BRKRED,PETG Carbon Fiber Brick Red,PETG_CF,Brick Red,#9F332A,kg,Active,28.79,0
PETG-CF,MAT-FDM-PETG_CF-VIOPUR,PETG Carbon Fiber Violet Purple,PETG_CF,Violet Purple,#583061,kg,Active,28.79,0
PETG-CF,MAT-FDM-PETG_CF-INDBLU,PETG Carbon Fiber Indigo Blue,PETG_CF,Indigo Blue,#324585,kg,Active,28.79,0
PETG-CF,MAT-FDM-PETG_CF-MALGRN,PETG Carbon Fiber Malachita Green,PETG_CF,Malachita Green,#16B08E,kg,Active,28.79,0
PETG-CF,MAT-FDM-PETG_CF-BLK,PETG Carbon Fiber Black,PETG_CF,Black,#000000,kg,Active,28.79,0
PETG-CF,MAT-FDM-PETG_CF-TITGRY,PETG Carbon Fiber Titan Gray,PETG_CF,Titan Gray,#565656,kg,Active,28.79,0
ABS,MAT-FDM-ABS-OLV,ABS Olive,ABS,Olive,#789D4A,kg,Active,19.99,0
ABS,MAT-FDM-ABS-TANYEL,ABS Tangerine Yellow,ABS,Tangerine Yellow,#FFC72C,kg,Active,19.99,0
ABS,MAT-FDM-ABS-AZR,ABS Azure,ABS,Azure,#489FDF,kg,Active,19.99,0
ABS,MAT-FDM-ABS-NAVBLU,ABS Navy Blue,ABS,Navy Blue,#0C2340,kg,Active,19.99,0
ABS,MAT-FDM-ABS-WHT,ABS White,ABS,White,#FFFFFF,kg,Active,19.99,0
ABS,MAT-FDM-ABS-SLV,ABS Silver,ABS,Silver,#87909A,kg,Active,19.99,0
ABS,MAT-FDM-ABS-RED,ABS Red,ABS,Red,#D32941,kg,Active,19.99,0
ABS,MAT-FDM-ABS-ORG,ABS Orange,ABS,Orange,#FF6A13,kg,Active,19.99,0
ABS,MAT-FDM-ABS-BAMGRN,ABS Bambu Green,ABS,Bambu Green,#00AE42,kg,Active,19.99,0
ABS,MAT-FDM-ABS-BLU,ABS Blue,ABS,Blue,#0A2CA5,kg,Active,19.99,0
ABS,MAT-FDM-ABS-PUR,ABS Purple,ABS,Purple,#AF1685,kg,Active,19.99,0
ABS,MAT-FDM-ABS-BLK,ABS Black,ABS,Black,#000000,kg,Active,19.99,0
ABS-GF,MAT-FDM-ABS_GF-WHT,ABS-GF White,ABS_GF,White,#FFFFFF,kg,Active,23.99,0
ABS-GF,MAT-FDM-ABS_GF-GRY,ABS-GF Gray,ABS_GF,Gray,#C6C6C6,kg,Active,23.99,0
ABS-GF,MAT-FDM-ABS_GF-YEL,ABS-GF Yellow,ABS_GF,Yellow,#FFE133,kg,Active,23.99,0
ABS-GF,MAT-FDM-ABS_GF-ORG,ABS-GF Orange,ABS_GF,Orange,#F48438,kg,Active,23.99,0
ABS-GF,MAT-FDM-ABS_GF-RED,ABS-GF Red,ABS_GF,Red,#E83100,kg,Active,23.99,0
ABS-GF,MAT-FDM-ABS_GF-GRN,ABS-GF Green,ABS_GF,Green,#61BF36,kg,Active,23.99,0
ABS-GF,MAT-FDM-ABS_GF-BLU,ABS-GF Blue,ABS_GF,Blue,#0C3B95,kg,Active,23.99,0
ABS-GF,MAT-FDM-ABS_GF-BLK,ABS-GF Black,ABS_GF,Black,#000000,kg,Active,23.99,0
ASA,MAT-FDM-ASA-WHT,ASA White,ASA,White,#FFFAF2,kg,Active,23.99,0
ASA,MAT-FDM-ASA-GRY,ASA Gray,ASA,Gray,#8A949E,kg,Active,23.99,0
ASA,MAT-FDM-ASA-RED,ASA Red,ASA,Red,#E02928,kg,Active,23.99,0
ASA,MAT-FDM-ASA-GRN,ASA Green,ASA,Green,#00A6A0,kg,Active,23.99,0
ASA,MAT-FDM-ASA-BLU,ASA Blue,ASA,Blue,#2140B4,kg,Active,23.99,0
ASA,MAT-FDM-ASA-BLK,ASA Black,ASA,Black,#000000,kg,Active,23.99,0
ASA,MAT-FDM-ASA-YEL,ASA Yellow,ASA,Yellow,#FFE133,kg,Active,23.99,0
TPU 68D,MAT-FDM-TPU_68D-RED,TPU 68D Red,TPU_68D,Red,#ED0000,kg,Active,27.99,0
TPU 68D,MAT-FDM-TPU_68D-YEL,TPU 68D Yellow,TPU_68D,Yellow,#F9EF41,kg,Active,27.99,0
TPU 68D,MAT-FDM-TPU_68D-BLU,TPU 68D Blue,TPU_68D,Blue,#5898DD,kg,Active,27.99,0
TPU 68D,MAT-FDM-TPU_68D-NEOGRN,TPU 68D Neon Green,TPU_68D,Neon Green,#90FF1A,kg,Active,27.99,0
TPU 68D,MAT-FDM-TPU_68D-WHT,TPU 68D White,TPU_68D,White,#FFFFFF,kg,Active,27.99,0
TPU 68D,MAT-FDM-TPU_68D-GRY,TPU 68D Gray,TPU_68D,Gray,#939393,kg,Active,27.99,0
TPU 68D,MAT-FDM-TPU_68D-BLK,TPU 68D Black,TPU_68D,Black,#000000,kg,Active,27.99,0
TPU 95A,MAT-FDM-TPU_95A-WHT,TPU 95A White,TPU_95A,White,#FFFFFF,kg,Active,33.59,0
TPU 95A,MAT-FDM-TPU_95A-YEL,TPU 95A Yellow,TPU_95A,Yellow,#F3E600,kg,Active,33.59,0
TPU 95A,MAT-FDM-TPU_95A-BLU,TPU 95A Blue,TPU_95A,Blue,#0072CE,kg,Active,33.59,0
TPU 95A,MAT-FDM-TPU_95A-RED,TPU 95A Red,TPU_95A,Red,#C8102E,kg,Active,33.59,0
TPU 95A,MAT-FDM-TPU_95A-GRY,TPU 95A Gray,TPU_95A,Gray,#898D8D,kg,Active,33.59,0
TPU 95A,MAT-FDM-TPU_95A-BLK,TPU 95A Black,TPU_95A,Black,#101820,kg,Active,33.59,0"""


def parse_csv():
    """Parse embedded CSV data into list of dicts"""
    lines = CSV_DATA.strip().split('\n')
    headers = [h.strip() for h in lines[0].split(',')]
    
    rows = []
    for line in lines[1:]:
        values = [v.strip() for v in line.split(',')]
        row = dict(zip(headers, values))
        rows.append(row)
    
    return rows


def get_or_create_filament_category(conn):
    """Get or create the Filament item category"""
    result = conn.execute(text(
        "SELECT id FROM item_categories WHERE code = 'FILAMENT'"
    )).fetchone()
    
    if result:
        return result[0]
    
    # Create it
    conn.execute(text("""
        INSERT INTO item_categories (code, name, description, is_active, created_at, updated_at)
        VALUES ('FILAMENT', 'Filament', 'FDM 3D printing filament materials', true, NOW(), NOW())
    """))
    conn.commit()
    
    result = conn.execute(text(
        "SELECT id FROM item_categories WHERE code = 'FILAMENT'"
    )).fetchone()
    return result[0]


def main():
    print("=" * 60)
    print("BAMBU LAB MATERIALS IMPORT")
    print("=" * 60)
    
    # Connect to database
    engine = create_engine(settings.database_url)
    Session = sessionmaker(bind=engine)
    session = Session()
    conn = session.connection()
    
    try:
        rows = parse_csv()
        print(f"\nParsed {len(rows)} materials from CSV")
        
        # Get filament category
        filament_category_id = get_or_create_filament_category(conn)
        print(f"Using filament category ID: {filament_category_id}")
        
        # Track what we create
        material_types_created = 0
        colors_created = 0
        material_colors_created = 0
        products_created = 0
        
        # Build unique lists
        material_types = {}  # code -> {name, base_material, price}
        colors = {}  # name -> hex_code
        material_color_combos = set()  # (type_code, color_name)
        
        for row in rows:
            type_code = row['Material Type']
            type_name = row['Category']
            color_name = row['Material Color Name']
            hex_code = row['HEX Code']
            price = Decimal(row['Price/kg'])
            
            # Track material type
            if type_code not in material_types:
                material_types[type_code] = {
                    'name': type_name,
                    'base_material': get_base_material(type_code),
                    'price': price
                }
            
            # Track color (use first hex code seen for this color name)
            if color_name not in colors:
                colors[color_name] = hex_code
            
            # Track combo
            material_color_combos.add((type_code, color_name))
        
        print(f"\nFound {len(material_types)} material types")
        print(f"Found {len(colors)} unique colors")
        print(f"Found {len(material_color_combos)} material-color combinations")
        
        # 1. Create MaterialTypes
        print("\n[1/4] Creating material types...")
        type_id_map = {}  # code -> id
        
        for code, info in material_types.items():
            # Check if exists
            result = conn.execute(text(
                "SELECT id FROM material_types WHERE code = :code"
            ), {'code': code}).fetchone()
            
            if result:
                type_id_map[code] = result[0]
                print(f"  EXISTS: {code}")
            else:
                base = info['base_material']
                density = MATERIAL_DENSITIES.get(base, Decimal('1.24'))
                
                conn.execute(text("""
                    INSERT INTO material_types 
                    (code, name, base_material, process_type, density, base_price_per_kg, 
                     price_multiplier, is_customer_visible, display_order, active, created_at, updated_at)
                    VALUES 
                    (:code, :name, :base, 'FDM', :density, :price, 
                     1.0, true, 100, true, NOW(), NOW())
                """), {
                    'code': code,
                    'name': info['name'],
                    'base': base,
                    'density': density,
                    'price': info['price']
                })
                
                result = conn.execute(text(
                    "SELECT id FROM material_types WHERE code = :code"
                ), {'code': code}).fetchone()
                type_id_map[code] = result[0]
                material_types_created += 1
                print(f"  CREATED: {code} (ID: {result[0]})")
        
        conn.commit()
        
        # 2. Create Colors
        print("\n[2/4] Creating colors...")
        color_id_map = {}  # name -> id
        
        for name, hex_code in colors.items():
            # Generate a code from the name
            code = name.upper().replace(' ', '_')[:30]
            
            # Check if exists by name
            result = conn.execute(text(
                "SELECT id FROM colors WHERE name = :name"
            ), {'name': name}).fetchone()
            
            if result:
                color_id_map[name] = result[0]
                print(f"  EXISTS: {name}")
            else:
                conn.execute(text("""
                    INSERT INTO colors 
                    (code, name, hex_code, display_order, is_customer_visible, active, created_at, updated_at)
                    VALUES 
                    (:code, :name, :hex, 100, true, true, NOW(), NOW())
                """), {
                    'code': code,
                    'name': name,
                    'hex': hex_code
                })
                
                result = conn.execute(text(
                    "SELECT id FROM colors WHERE name = :name"
                ), {'name': name}).fetchone()
                color_id_map[name] = result[0]
                colors_created += 1
                print(f"  CREATED: {name} ({hex_code})")
        
        conn.commit()
        
        # 3. Create MaterialColor junction records
        print("\n[3/4] Creating material-color combinations...")
        
        for type_code, color_name in material_color_combos:
            type_id = type_id_map[type_code]
            color_id = color_id_map[color_name]
            
            # Check if exists
            result = conn.execute(text("""
                SELECT id FROM material_colors 
                WHERE material_type_id = :type_id AND color_id = :color_id
            """), {'type_id': type_id, 'color_id': color_id}).fetchone()
            
            if not result:
                conn.execute(text("""
                    INSERT INTO material_colors 
                    (material_type_id, color_id, is_customer_visible, display_order, active)
                    VALUES 
                    (:type_id, :color_id, true, 100, true)
                """), {'type_id': type_id, 'color_id': color_id})
                material_colors_created += 1
        
        conn.commit()
        print(f"  Created {material_colors_created} material-color links")
        
        # 4. Create Products
        print("\n[4/4] Creating products...")
        
        for row in rows:
            sku = row['SKU']
            name = row['Name']
            type_code = row['Material Type']
            color_name = row['Material Color Name']
            price = Decimal(row['Price/kg'])
            
            type_id = type_id_map[type_code]
            color_id = color_id_map[color_name]
            
            # Check if product exists
            result = conn.execute(text(
                "SELECT id FROM products WHERE sku = :sku"
            ), {'sku': sku}).fetchone()
            
            if result:
                print(f"  EXISTS: {sku}")
            else:
                conn.execute(text("""
                    INSERT INTO products 
                    (sku, name, description, unit, purchase_uom, item_type, procurement_type,
                     category_id, material_type_id, color_id, cost_method, standard_cost,
                     is_raw_material, has_bom, track_lots, active, type, created_at, updated_at)
                    VALUES 
                    (:sku, :name, :desc, 'G', 'KG', 'supply', 'buy',
                     :cat_id, :type_id, :color_id, 'average', :cost,
                     true, false, true, true, 'standard', NOW(), NOW())
                """), {
                    'sku': sku,
                    'name': name,
                    'desc': f'Bambu Lab {name}',
                    'cat_id': filament_category_id,
                    'type_id': type_id,
                    'color_id': color_id,
                    'cost': price
                })
                products_created += 1
                print(f"  CREATED: {sku}")
        
        conn.commit()
        
        # Summary
        print("\n" + "=" * 60)
        print("IMPORT COMPLETE")
        print("=" * 60)
        print(f"Material Types: {material_types_created} created")
        print(f"Colors: {colors_created} created")
        print(f"Material-Color Links: {material_colors_created} created")
        print(f"Products: {products_created} created")
        print("=" * 60)
        
    except Exception as e:
        print(f"\nERROR: {e}")
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == '__main__':
    main()
