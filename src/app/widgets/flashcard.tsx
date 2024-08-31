import { useState } from "react";

interface FlashCardProps {
    id: string;
    question: string;
    answer: string;
}

export default function FlashCard({ id, question, answer }: FlashCardProps) {
    const [ansShown, setAnsShown] = useState(false);

    const toggleAns = () => {
        setAnsShown(!ansShown);
    };

    return (
        <div
            key={id}
            className="bg-gray-800 rounded-lg shadow-md transition-all duration-500 cursor-pointer border-2 border-gray-700"
            onClick={toggleAns}
        >
            <div className='w-full flex flex-col md:flex-row'>
                <div className="text-xl font-semibold w-full md:w-1/2 border-b-2 md:border-r-2 md:border-b-0 border-gray-700 p-4">
                    {question}
                </div>
                <div className="text-md text-gray-400 text-center font-semibold w-full md:w-1/2 p-4">
                    {ansShown ? answer : 'Click to see answer'}
                </div>
            </div>
        </div>
    );
}