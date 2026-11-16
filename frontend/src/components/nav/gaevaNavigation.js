// Presentation only. Paths, access gates and order remain owned by navConfig.
const labels = {
  "Command Center": "Painel inicial", "Analytics": "Indicadores", "Advanced Analytics": "Indicadores avançados",
  "SALES": "Comercial", "Customers": "Contatos", "Quotes": "Propostas", "Orders": "Pedidos", "Shipping": "Expedição", "Messages": "Mensagens",
  "MONEY": "Financeiro", "Invoices": "Faturas", "Payments": "Pagamentos", "Accounting": "Contabilidade",
  "OPERATIONS": "Operação", "Production": "Produção", "Work Centers & Routings": "Centros e roteiros", "Printers": "Impressoras", "Material Spools": "Carretéis", "Intake Studio": "Estúdio de entrada", "Intake Batch": "Entrada em lote",
  "INVENTORY": "Estoque", "Items": "Itens e modelos", "Bill of Materials": "Lista de materiais", "Locations": "Locais", "Transactions": "Movimentações", "Cycle Count": "Inventário cíclico",
  "PURCHASING": "Compras", "Purchasing": "Compras", "Import Materials": "Importar materiais",
  "B2B PORTAL": "Portal B2B", "Access Requests": "Solicitações de acesso", "Catalogs": "Catálogos", "Price Levels": "Tabelas de preço",
  "QUALITY": "Qualidade", "Quality Dashboard": "Painel de qualidade", "Quality Plans": "Planos de qualidade", "Material Traceability": "Rastreabilidade",
  "ADMIN": "Administração", "Team Members": "Equipe", "Security Audit": "Auditoria de segurança", "Settings": "Configurações", "Integrations": "Integrações", "License": "Licença", "Import Orders": "Importar pedidos", "Scrap Reasons": "Motivos de perda"
};
export const gaevaLabel = (label) => labels[label] || label;
