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
            className="bg-gray-800 rounded-lg shadow-md transition-all duration-500 cursor-pointer"
            onClick={toggleAns}
        >
            <table className="w-full">
                <tbody>
                    <tr>
                        <td className="text-xl font-semibold w-1/2 border-r-2 border-gray-700 p-4">
                            {question}
                        </td>
                        <td className="text-md text-gray-400 text-center font-semibold w-1/2 p-4">
                            {ansShown ? answer : 'Click to see answer'}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}