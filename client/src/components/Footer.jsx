const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SmartMeal AI</h3>
            <p className="text-gray-400">
              Your AI-powered cooking assistant for discovering and sharing amazing recipes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/recipes" className="hover:text-white transition-colors">Browse Recipes</a></li>
              <li><a href="/ai-generator" className="hover:text-white transition-colors">AI Generator</a></li>
              <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <p className="text-gray-400">
              SmartMeal AI helps you create delicious meals with AI-powered recipe recommendations.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SmartMeal AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


