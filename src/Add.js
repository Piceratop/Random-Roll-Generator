import { db } from './firebase';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
} from 'firebase/firestore';

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

    const addWordToDb = async () => {
        const a = await getDocs(dbRef);
        const wordLists = a.docs.map((item) => {
            return { ...item.data(), id: item.id };
        });
        let allSubject = wordLists.map((item) => item.subject);

        if (allSubject.includes(dict.subject)) {
            //Search for the subject in the database
            let index = allSubject.indexOf(dict.subject);
            let docRef = doc(db, 'ieltsSubject', wordLists[index].id);

            //Update the vocabularies
            let newVocab = [...wordLists[index].vocabularies];
            for (let i = 0; i < dict.vocabularies.length; i++) {
                if (!newVocab.includes(dict.vocabularies[i])) {
                    newVocab.push(dict.vocabularies[i]);
                }
            }
            await updateDoc(docRef, { vocabularies: newVocab })
                .then(() => {
                    alert('Update successfully!');
                })
                .catch((error) => {
                    alert(error);
                });
        } else {
            await addDoc(dbRef, dict)
                .then(() => {
                    alert('Add successfully!');
                })
                .catch((err) => {
                    alert(err);
                });
        }
    };
    return (
        <main>
            <Link to="/" className="navigation return">
                Return to Home
            </Link>
            <br />
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
