#!/bin/bash

echo "🚀 Setting up Luma SA project..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install user-app dependencies
echo "📦 Installing user-app dependencies..."
cd user-app
npm install
cd ..

# Install backoffice-app dependencies
echo "📦 Installing backoffice-app dependencies..."
cd backoffice-app
npm install
cd ..

# Install shared dependencies
echo "📦 Installing shared dependencies..."
cd shared
npm install
cd ..

# Install scripts dependencies
echo "📦 Installing script dependencies..."
cd scripts
npm install
cd ..

echo "✅ Installation complete!"
echo ""
echo "🌟 Next steps:"
echo "1. Initialize Firestore with sample data (recommended):"
echo "   cd scripts && npm run init-firestore && cd .."
echo "2. Run 'npm run dev' to start both applications"
echo ""
echo "🔗 Applications will be available at:"
echo "   • User App: http://localhost:3000"
echo "   • Backoffice App: http://localhost:3001"
echo ""
echo "🔥 Firebase Setup:"
echo "   • Create admin user: admin@lumasa.co.za in Firebase Console"
echo "   • All tabs now work with real-time data!"
echo ""
echo "Made with ❤️ in South Africa"