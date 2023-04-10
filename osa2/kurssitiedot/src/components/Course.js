import React from "react"

//Subcomponents
const Header = ({ name }) => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
      <Total parts={parts} />
    </div>
  )
}

const Part = ({ part }) => {
  return (
    <div>
      {part.name} {part.exercises}
    </div>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((acc, part) => acc + part.exercises, 0)
  return <b>Total of {total} exercises</b>
}

//Main component
const Course = ({ course }) => (
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
  </div>
)

export default Course
