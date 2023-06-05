import { useState } from "react"

const Books = (props) => {
  var allBooks = null
  var [books, setBooks] = useState([])
  var [selectedGenre, setSelectedGenre] = useState('')

  const filterByGenre = (genre) => {
    allBooks = props.allBooksResult.data.allBooks
    if (genre !== 'all genres') {
      setBooks(allBooks.filter(b => b.genres.includes(genre)))
    }
    else {
      setBooks(allBooks)
    }
    setSelectedGenre(genre)
  }

  if (!props.show) {
    return null
  }

  if (props.allBooksResult.loading) {
    return <div>Loading...</div>
  }
  
  return (
    <div>
      <h2>Books</h2>
      <p>In genre: <b>{selectedGenre}</b></p>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => filterByGenre('refactoring')}>Refactoring</button>
        <button onClick={() => filterByGenre('agile')}>Agile</button>
        <button onClick={() => filterByGenre('patterns')}>Patterns</button>
        <button onClick={() => filterByGenre('design')}>Design</button>
        <button onClick={() => filterByGenre('crime')}>Crime</button>
        <button onClick={() => filterByGenre('classic')}>Classic</button>
        <button onClick={() => filterByGenre('all genres')}>All genres</button>
      </div>
    </div>
  )
}

export default Books
