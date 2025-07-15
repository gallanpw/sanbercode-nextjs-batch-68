'use client'; // WAJIB: Menandai ini sebagai Client Component

import { useState } from 'react';

export default function ClientCounter() {
    const [count, setCount] = useState(0);

    return (
        <div className="bg-purple-100 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Client-Side Counter</h2>
            <p className="text-xl mb-4">Count: {count}</p>
            <button
                onClick={() => setCount(count + 1)}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
                Increment
            </button>
            <button
                onClick={() => setCount(count - 1)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                Decrement
            </button>
        </div>
    );
}