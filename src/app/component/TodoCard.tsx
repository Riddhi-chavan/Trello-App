"use client"
import { XCircleIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useState } from 'react'
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';
import { useBoardStore } from '../../../store/BoardStore';
import getUrl from '../../../lib/getUrl';
import Image from 'next/image';


type Props = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;

}



function TodoCard({ todo, index, id, innerRef, dragHandleProps, draggableProps }: Props) {

    const deleteTask = useBoardStore((state) => state.deleteTask)
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
   

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const url = await getUrl(todo.image!);
                setImageUrl(url.toString());

                // Use a unique localStorage key for each todo
                const localStorageKey = `imageUrl_${todo.$id}`;
                localStorage.setItem(localStorageKey, url.toString());
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        // Use a unique localStorage key for each todo
        const localStorageKey = `imageUrl_${todo.$id}`;
        const storedImageUrl = localStorage.getItem(localStorageKey);

        if (storedImageUrl) {
            // If the image URL is already stored, use it
            setImageUrl(storedImageUrl);
        } else if (todo.image) {
            // Otherwise, fetch the image
            fetchImage();
        }
    }, [todo]);
    console.log("image url", imageUrl);


    return (
        <div
            className='bg-white rounded-md space-y-2 drop-shadow-md'
            {...dragHandleProps}
            {...draggableProps}
            ref={innerRef}
        >
            <div className='flex justify-between items-center p-5'>
                <p>{todo.title}</p>
                <button onClick={() => deleteTask(index, todo, id)} className='text-red-500 hover:text-red-600'>
                    <XCircleIcon className='ml-5 h-8 w-8' />
                </button>
            </div>
            {imageUrl && (
                <div className=' h-full w-full rounded-b-md'>
                    <Image
                        src={imageUrl}
                        alt='Task image'
                        width={400}
                        height={200}
                        className="w-full object-contain rounded-b-md"
                    />

                </div>
            )}
        </div>
    )
}

export default TodoCard

