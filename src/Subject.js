import { db } from './firebase';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

export default function Subject() {
    const [allDict, setAllDict] = useState([]);
    const [dict, setDict] = useState({ subject: '', vocabularies: [] });
    const [remWords, setRemWords] = useState([]);
    const [notice, setNotice] = useState('Comment:');
    const dbRef = collection(db, 'ieltsSubject');
    const [wordsCheck, setWordsCheck] = useState(null);
    useEffect(() => {
        async function getData() {
            const a = await getDocs(dbRef);
            const wordLists = a.docs.map((item) => {
                return { ...item.data(), id: item.id };
            });
            setAllDict(wordLists);
            const randomIndex = Math.floor(Math.random() * wordLists.length);
            setDict({ ...wordLists[randomIndex] });
        }
        getData();
    }, []);
    const showAllWord = () => {
        let allWords = dict.vocabularies.map((word) => {
            if (remWords.includes(word)) {
                return <span>{`${word}, `}</span>;
            } else {
                return (
                    <>
                        <span style={{ color: 'red' }}>{word}</span>
                        {', '}
                    </>
                );
            }
        });
        setWordsCheck(allWords);
    };
    return (
        <main>
            <Link to="/" className="navigation return">
                Return to Home
            </Link>
            <h2>Subject: {dict.subject}</h2>
            <p>
                Change subject:{' '}
                <input
                    type="text"
                    id="new-subject"
                    name="new-subject"
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            const newSub = event.target.value;
                            for (let i = 0; i < allDict.length; i++) {
                                if (allDict[i].subject === newSub) {
                                    setDict({ ...allDict[i] });
                                    setRemWords([]);
                                    setNotice(
                                        `Comment: The new subject is '${newSub}'.`
                                    );
                                    return;
                                }
                            }
                            setNotice(
                                `Comment: The subject '${newSub}' is not found.`
                            );
                        }
                    }}
                />
            </p>
            <label htmlFor="recall">
                Recall as many words as possible from this category.
            </label>
            <input
                type="text"
                id="recall"
                name="recall"
                onKeyDown={(event) => {
                    if (event.code === 'Enter') {
                        let newWord = event.target.value;
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
                    }
                }}
            />
            <p>{notice}</p>
            <p>
                Remembered words:{' '}
                {remWords.map((word, index) => {
                    return <span id={index}> {`${word}, `}</span>;
                })}
            </p>
            <button onClick={showAllWord}>All words</button>
            <p>All words in this category: {wordsCheck}</p>
        </main>
    );
}
