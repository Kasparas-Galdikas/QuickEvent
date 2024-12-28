export default function SecondaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
        {...props}
        className={`inline-flex items-center justify-center rounded-md border border-[#E8D8A6] bg-[#F3E5AB] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#5A5A5A]
                    transition duration-150 ease-in-out 
                    hover:bg-[#FEEBC8] hover:border-[#D6BA7B] 
                    focus:bg-[#FFF4E6] focus:border-[#C9A564] focus:ring-2 focus:ring-[#C9A564] focus:ring-offset-2 
                    active:bg-[#FEEBC8] active:border-[#C9A564] ${
                      disabled ? 'opacity-25 cursor-not-allowed' : ''
                    } ` + className}
        disabled={disabled}
      >
        {children}
      </button>
    );
}
