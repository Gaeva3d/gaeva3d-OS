#!/bin/bash
# generate-release.sh
# 
# Generates release artifacts with SHA256 checksums and optional GPG signing
# Usage: ./scripts/generate-release.sh v1.0.0

set -e

VERSION=${1:-$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0-dev")}
DIST_DIR="dist"
GPG_KEY_ID="${GPG_KEY_ID:-}"  # Set your key ID or leave empty to skip signing

echo "================================================"
echo "FilaOps Release Generator"
echo "Version: $VERSION"
echo "================================================"
echo ""

# Create dist directory
mkdir -p "$DIST_DIR"

# Clean previous artifacts
rm -f "$DIST_DIR"/*.tar.gz "$DIST_DIR"/*.zip "$DIST_DIR"/SHA256SUMS*

echo "[1/5] Creating source tarball..."
tar -czvf "$DIST_DIR/filaops-$VERSION-source.tar.gz" \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='__pycache__' \
    --exclude='.pytest_cache' \
    --exclude='*.pyc' \
    --exclude='.env' \
    --exclude='.env.*' \
    --exclude='dist' \
    --exclude='venv' \
    --exclude='.venv' \
    --exclude='*.log' \
    . 2>/dev/null || true

echo "[2/5] Creating backend package..."
if [ -d "backend" ]; then
    tar -czvf "$DIST_DIR/filaops-$VERSION-backend.tar.gz" \
        --exclude='__pycache__' \
        --exclude='*.pyc' \
        --exclude='.env' \
        backend/ 2>/dev/null || true
else
    echo "  No backend/ directory found, skipping..."
fi

echo "[3/5] Creating frontend package..."
if [ -d "frontend" ]; then
    tar -czvf "$DIST_DIR/filaops-$VERSION-frontend.tar.gz" \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='build' \
        frontend/ 2>/dev/null || true
else
    echo "  No frontend/ directory found, skipping..."
fi

echo "[4/5] Generating SHA256 checksums..."
cd "$DIST_DIR"
sha256sum *.tar.gz > SHA256SUMS.txt 2>/dev/null || sha256sum *.tar.gz *.zip > SHA256SUMS.txt 2>/dev/null || true
cd ..

echo ""
echo "=== SHA256SUMS.txt ==="
cat "$DIST_DIR/SHA256SUMS.txt"
echo ""

echo "[5/5] GPG signing..."
if [ -n "$GPG_KEY_ID" ]; then
    echo "  Signing with key: $GPG_KEY_ID"
    gpg --armor --detach-sign --default-key "$GPG_KEY_ID" "$DIST_DIR/SHA256SUMS.txt"
    mv "$DIST_DIR/SHA256SUMS.txt.asc" "$DIST_DIR/SHA256SUMS.txt.sig"
    echo "  ✅ Signed: SHA256SUMS.txt.sig"
else
    echo "  ⚠️  No GPG_KEY_ID set, skipping signing"
    echo "  Set GPG_KEY_ID environment variable to enable:"
    echo "  export GPG_KEY_ID=ABCD1234EFGH5678"
fi

echo ""
echo "================================================"
echo "Release artifacts created in: $DIST_DIR/"
echo "================================================"
ls -la "$DIST_DIR"
echo ""
echo "Next steps:"
echo "1. Review the artifacts"
echo "2. Create a GitHub release"
echo "3. Upload all files from $DIST_DIR/"
echo ""

# Verify checksums work
echo "Verifying checksums..."
cd "$DIST_DIR"
if sha256sum -c SHA256SUMS.txt; then
    echo "✅ Checksums verified successfully"
else
    echo "❌ Checksum verification failed!"
    exit 1
fi
cd ..

echo ""
echo "Done! 🎉"