import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ onClick, text }) => (
    <button onClick={onClick}>
        {text}
    </button>
)

const App = (props) => {
    const [selected, setSelected] = useState(0)
    const [points, setPoints] = useState([0, 0, 0, 0, 0, 0])
    const [biggest, setBiggest] = useState(0)

    const handleVote = () => {
        const copy = [...points]
        copy[selected] += 1
        setPoints(copy)
        if (copy[selected] > copy[biggest]) {
            setBiggest(selected)
        }
    }

    return (
        <div>
            <h1>Anecdote of the day</h1>
            <h3>{props.anecdotes[selected]}</h3>
            <p>This has {points[selected]} votes</p>
            <p>
                <Button onClick={() =>
                    setSelected(Math.round(Math.random() * 5))}
                    text='New anecdote!' />
                <Button onClick={handleVote}
                    text='Vote' />
            </p>
            <h1>Anecdote with most votes</h1>
            <h3>{props.anecdotes[biggest]}</h3>
            <p>This has {points[biggest]} votes</p>
        </div>
    )
}

const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
    <App anecdotes={anecdotes} />,
    document.getElementById('root')
)