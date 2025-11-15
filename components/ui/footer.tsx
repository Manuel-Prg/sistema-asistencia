// components/footer.tsx
export function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            © {new Date().getFullYear()} Todos los derechos reservados. Casa Universitaria del Agua
          </p>
          
          {/* Links opcionales */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Versión 1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}