import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
        {...props}
        type={type}
        className={`rounded-md border-[1px] border-[#C9A564] bg-[#FFF9C4] text-dark px-4 py-2 shadow-sm 
                    focus:border-[#B89C64] focus:ring-2 focus:ring-[#B89C64] focus:outline-none 
                    transition duration-150 ease-in-out ` + className}
        ref={localRef}
      />
      
      
    );
});
