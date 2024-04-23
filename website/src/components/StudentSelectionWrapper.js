import { createContext, useState } from 'react';

export const StudentSelectionContext = createContext({
    selectedStudent: '',
    setSelectedStudent: () => { }
});

export default function StudentSelectionWrapper({ children }) {
    const [selectedStudent, setSelectedStudent] = useState('');

    return (
        <StudentSelectionContext.Provider value={{
            selectedStudent,
            setSelectedStudent,
        }}>
            {children}
        </StudentSelectionContext.Provider>
    )

}