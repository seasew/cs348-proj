import { useState, useEffect } from 'react';

const Display = () => {
    // Retrieve all logs from the server
    // and display them in a list format

    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetch('/api/logs')
            .then(response => response.json())
            .then(data => setLogs(data));
    }, [setLogs]);

    return (
        <div>
            <p>Display</p>
            {
                logs.length > 0 ? (
                    <ul>
                        {logs.map((log, index) => (
                            <li key={index}>
                                <p>{log.id}, {log.date}, {log.mood}, {log.mood_color}, {log.note}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No logs available</p>
                )
            }
        </div>
    );
};

export default Display;