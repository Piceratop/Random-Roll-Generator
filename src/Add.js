import { db } from './firebase';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';

export default function Add() {
    const [dict, setDict] = useState({
        subject: '',
        vocabularies: [],
    });
    const dbRef = collection(db, 'ieltsSubject');
    const updateWord = (word) => {
        let newWord = word;
        while (newWord.length > 0 && !/[a-zA-Z]/.test(newWord[0])) {
            newWord = newWord.substring(1);
        }
        while (
            newWord.length > 0 &&
            !/[a-zA-Z]/.test(newWord[newWord.length - 1])
        ) {
            newWord = newWord.substring(0, newWord.length - 1);
        }
        newWord = newWord.toLowerCase();
        return newWord;
    };
    const handleInput = (e) => {
        let n = e.target.name;
        if (n === 'vocab') {
            let wordLists = e.target.value.split(',');
            for (let i = 0; i < wordLists.length; i++) {
                wordLists[i] = updateWord(wordLists[i]);
            }
            setDict({ ...dict, vocabularies: wordLists });
        } else {
            let sub = e.target.value;
            setDict({ ...dict, subject: sub });
        }
    };
    const addWordToDb = () => {
        addDoc(dbRef, dict)
            .then(() => {
                alert('Successfully added to database!');
            })
            .catch((err) => {
                alert(err);
            });
    };
    return (
        <main>
            <label htmlFor="subject-name">Custom subject:</label>
            <input
                type="text"
                id="subject-name"
                name="subject-name"
                onChange={(e) => handleInput(e)}
            />
            <br />

            <label htmlFor="vocab">Custom vocabularies:</label>
            <textarea
                id="vocab"
                name="vocab"
                onChange={(e) => handleInput(e)}
            ></textarea>
            <button onClick={() => addWordToDb()}>Add word</button>
        </main>
    );
}
