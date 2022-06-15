import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <main>
            <Link to="/subject" className="navigation">
                Subject
            </Link>
            <Link to="/add" className="navigation">
                Add
            </Link>
        </main>
    );
}
