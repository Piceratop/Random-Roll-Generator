import { db } from './firebase';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

export default function Subject() {
    const [dict, setDict] = useState({ subject: '', vocabularies: [] });
    const [remWords, setRemWords] = useState([]);
    const [curWord, setCurWord] = useState('');
    const [notice, setNotice] = useState('Comment:');
    const dbRef = collection(db, 'ieltsSubject');
    useEffect(() => {
        async function getData() {
            const a = await getDocs(dbRef);
            const wordLists = a.docs.map((item) => {
                return { ...item.data(), id: item.id };
            });
            // Get a random integer between 0 and the length of the array
            const randomIndex = Math.floor(Math.random() * wordLists.length);
            setDict({ ...wordLists[randomIndex] });
        }
        getData();
    }, []);
    return (
        <main>
            <h2>{dict.subject}</h2>
            <label htmlFor="recall">
                Recall as many words as possible from this category.
            </label>
            <input
                type="text"
                id="recall"
                name="recall"
                onChange={(event) => {
                    setCurWord(event.target.value);
                }}
                onKeyDown={(event) => {
                    if (event.code === 'Enter') {
                        let newWord = curWord;
                        while (
                            newWord.length > 0 &&
                            !/[a-zA-Z]/.test(newWord[0])
                        ) {
                            newWord = newWord.substring(1);
                        }
                        while (
                            newWord.length > 0 &&
                            !/[a-zA-Z]/.test(newWord[0])
                        ) {
                            newWord = newWord.substring(0, newWord.length - 1);
                        }
                        newWord = newWord.toLowerCase();
                        if (
                            dict.vocabularies.includes(newWord) &&
                            !remWords.includes(newWord)
                        ) {
                            setRemWords([...remWords, newWord]);
                            document.getElementById('recall').value = '';
                            setNotice(`Comment: '${newWord}' is correct!`);
                        } else {
                            setNotice(
                                `Comment: '${newWord}' is not in this category or is added earlier.`
                            );
                        }
                        setCurWord('');
                    }
                }}
            />
            <p>{notice}</p>
            <p>Remembered words:</p>
            <p>
                {remWords.map((word, index) => {
                    return <span id={index}> {`${word}, `}</span>;
                })}
            </p>
        </main>
    );
}
