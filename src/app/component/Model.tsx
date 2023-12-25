"use client"
import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useModelStore } from '../../../store/ModelStore'
import { useBoardStore } from '../../../store/BoardStore'
import TaksRadioGroup from './TaksRadioGroup'
import Image from 'next/image'
import { PhotoIcon } from '@heroicons/react/16/solid'
import { FormEvent } from 'react'

function Model() {
    const imagePicker = useRef<HTMLInputElement>(null);

    const [addTask, image,  setImage, newTaskInput, setNewTaskInput,  newTaskType] = useBoardStore((state) => [
        state.addTask,
        state.image,
        state.setImage,
        state.newTaskInput,
        state.setNewTaskInput,

       
        
        state.newTaskType
    ]);
    const [isOpen, closeModel] = useModelStore((state) => [
        state.isOpen,
        state.closeModel,
    ]);

    const handlSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submitting")
        if (!newTaskInput) return;
        addTask(newTaskInput, newTaskType, image)
        setImage(null);
        closeModel();
    }

    return (
        // Use the `Transition` component at the root level
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                onSubmit={handlSubmit}
                as='form'
                className="relative z-10"
                onClose={closeModel}>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0  bg-black bg-opacity-25" />
                </Transition.Child>



                <div className='fixed inset-0 overflow-y-auto'>

                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all transform">
                                <Dialog.Title
                                    as='h3'
                                    className="text-lg font-medium leading-6 text-gray-900 pb-2"
                                >
                                    Add a Task
                                </Dialog.Title>
                                <div className="mt-2">
                                    <input
                                        type='text'
                                        value={newTaskInput}
                                        onChange={(e) => setNewTaskInput(e.target.value)}
                                        placeholder='Enter a task here...'
                                        className='w-full border border-gray-300 rounded-md outline-none p-5'

                                    />

                                </div>
                                <TaksRadioGroup />
                                <div className='mt-2'>

                                    <button
                                        type='button'
                                        onClick={() => {
                                            imagePicker.current?.click()
                                        }}

                                        className='w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:offset-2'>
                                        <PhotoIcon
                                            className='h-6 w-6 mr-2 inline-block'
                                        />
                                        Upload Image
                                    </button>
                                    {
                                        image && (
                                            <Image
                                                alt="Uploaded Image"
                                                width={200}
                                                height={200}
                                                className={`w-full h-44 object-cover  filter hover:grayscale transition-all duration-150 cursor-not-allowed`}
                                                src={URL.createObjectURL(image)}
                                                onClick={() => {
                                                    setImage(null)
                                                }}
                                            />
                                        )
                                    }

                                    <input
                                        type='file'
                                        ref={imagePicker}
                                        hidden
                                        onChange={(e) => {
                                            if (!e.target.files![0].type.startsWith("image/")) return;
                                            setImage(e.target.files![0]);
                                        }}
                                    />
                                </div>
                                <div className='mt-2'>
                                    <button
                                        type="submit"
                                        disabled={!newTaskInput}
                                        className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowedk    '
                                    >
                                        Add Task
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>


                    </div>

                </div>

            </Dialog>
        </Transition>
    )
}

export default Model