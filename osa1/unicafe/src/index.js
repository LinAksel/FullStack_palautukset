import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistic = ({ text, value }) => {
    return (
        <tr><td>{text}</td><td>{value}</td></tr>
    )
}

const Statistics = ({ g, n, b }) => {
    const summa = g + n + b
    const keskiarvo = (g - b) / summa
    const positiivinen = g * 100 / summa + ' %'
    if (summa === 0) {
        return (
            <div>
                <p>No feedback given</p>
            </div>
        )
    }
    return (
        <div>
            <table>
                <tbody>
                    <Statistic text='good' value={g} />
                    <Statistic text='neutral' value={n} />
                    <Statistic text='bad' value={b} />
                    <Statistic text='all' value={summa} />
                    <Statistic text='average' value={keskiarvo} />
                    <Statistic text='positive' value={positiivinen} />
                </tbody>
            </table>
        </div>
    )
}

const Display = (props) => <div><h1>{props.text}</h1></div>

const Button = ({ onClick, text }) => (
    <button onClick={onClick}>
        {text}
    </button>
)

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <Display text='Give feedback' />
            <Button onClick={() => setGood(good + 1)} text='good' />
            <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
            <Button onClick={() => setBad(bad + 1)} text='bad' />
            <Display text='Statistics' />
            <Statistics g={good} n={neutral} b={bad} />
        </div>
    )
}

ReactDOM.render(<App />,
    document.getElementById('root')
)