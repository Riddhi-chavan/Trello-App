"use client"
import Image from 'next/image'
import React, {  useEffect, useState } from 'react'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/16/solid'
import Avatar from 'react-avatar'
import { useBoardStore } from '../../../store/BoardStore'
import fetchSuggestion from "../../../lib/fetchSuggestion"

const Header = () => {

    const [board, searchString, setSearchString] = useBoardStore((state) => [
        state.board,
        state.searchString,
        state.setSearchString,
    ])

    const [loading, setloading] = useState<boolean>(false);
    const [suggestion, setsuggestion] = useState<string>("");

    useEffect(() => {
        if (board.columns.size === 0) return;
        setloading(true);
        const fetchsuggestionfucns = async () => {
            const suggestion = await fetchSuggestion(board);
            setsuggestion(suggestion);
            setloading(false);

        }
        fetchsuggestionfucns();

    }, [board])



    return (
        <header>

            <div className='flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl'>
                <div
                    className='
                absolute
                top-0
                left-0
                w-full
                h-96
                bg-gradient-to-br
                from-pink-400
                to-[#0055D1]
                rouded-md
                filter 
                blur-3xl
                opacity-50
                -z-50
                '
                />
                <Image
                    src="/Trello-logo.png"
                    alt='Trello-image'
                    width={300}
                    height={100}
                    className='w-44 md:w-56 pb-6 md:pb-0 object-contain'
                />
                <div className='flex items-center space-x-5 flex-1 justify-end w-full'>
                    <form className='flex items-center space-x-5 w-44 md:w-auto  mt-3 md:mt-0 bg-white rounded-md p-2 shadow-md flex-1  md:flex-initial'>
                        <MagnifyingGlassIcon className='h-5 text-gray-400 mt-1' />
                        <input type='text' value={searchString} placeholder='Search' className='flex-1 outline-none p-1 w-full md:w-auto' onChange={(e) => setSearchString(e.target.value)} />
                        <button hidden type='submit' >Search</button>
                    </form>
                    <Avatar name='Riddhi Chavan' className='bg-none mt-1 md:mt-0' size='50' round color='#0055D1' />
                </div>
            </div>

            <div className='flex items-center justify-center px-5 py-2  md:py-5'>
                <p className='flex items-center text-sm font-light pr-4 shadow-xl p-5 rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]'>
                    <UserCircleIcon className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${loading && "animate-spin"}`} />
                    {suggestion && !loading ? suggestion :
                        "GPT  is summnerising your task for a day...."
                    }
                </p>
            </div>
        </header>
    )
}

export default Header
