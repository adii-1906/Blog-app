import React, { useRef, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Header = () => {
    const { setInput, input } = useAppContext();
    const inputRef = useRef();

    // Sync the input field with context value
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = input;
        }
    }, [input]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setInput(inputRef.current.value.trim()); // Trim to avoid accidental whitespaces
    };

    const onClear = () => {
        setInput('');
        inputRef.current.value = '';
    };

    return (
        <div className='mx-8 sm:mx-16 xl:mx-24 relative'>
            <div className='text-center mt-20 mb-8'>

                {/* Notification Badge */}
                <div className='inline-flex items-center justify-center gap-2 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary'>
                    <p>New: AI feature integrated</p>
                    <img src={assets.star_icon} alt="Star Icon" className='w-2.5' />
                </div>

                {/* Heading */}
                <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-[4.5rem] text-gray-700'>
                    Your own <span className='text-primary'>blogging</span> <br />platform.
                </h1>

                {/* Description */}
                <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500'>
                    This is your space to think out loud, to share what matters, and to write without filters.
                    Whether it's one word or a thousand, your story starts right here.
                </p>

                {/* Search Form */}
                <form 
                    onSubmit={onSubmitHandler}
                    className='flex justify-between max-w-lg max-sm:scale-90 mx-auto border border-gray-300 bg-white rounded overflow-hidden'
                >
                    <input 
                        ref={inputRef}
                        type="text"
                        placeholder='Search for blogs'
                        aria-label="Search input"
                        className='w-full pl-4 py-2 outline-none text-gray-700 placeholder:text-sm placeholder:text-gray-400'
                    />
                    <button 
                        type='submit'
                        className='bg-primary text-white px-6 py-2 m-1.5 rounded hover:scale-105 transition-transform duration-200 cursor-pointer'
                    >
                        Search
                    </button>
                </form>

            </div>

            {/* Clear Search Button */}
            <div className='text-center mt-2'>
                {input && (
                    <button 
                        onClick={onClear}
                        className='border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer text-gray-600 hover:bg-gray-100 transition-all'
                    >
                        Clear Search
                    </button>
                )}
            </div>

            {/* Decorative Background */}
            <img 
                src={assets.gradientBackground}
                alt="Gradient Background"
                className='absolute -top-50 -z-10 opacity-50 w-full'
            />
        </div>
    )
}

export default Header;
