import { motion } from 'framer-motion'

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseClasses = 'font-semibold py-2 px-6 rounded-lg transition-all duration-300'
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-white text-primary-600 border-2 border-primary-500 hover:bg-primary-50',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </motion.button>
  )
}

export default Button


