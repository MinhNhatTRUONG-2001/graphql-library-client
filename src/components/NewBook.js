import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ADD_NEW_BOOK, ALL_AUTHORS, ALL_BOOKS } from '../GraphQLQueries'
import { notiTypeEnum } from '../NotiTypeEnum'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ addNewBook ] = useMutation(ADD_NEW_BOOK, {
    //refetchQueries: [ {query: ALL_BOOKS}, {query: ALL_AUTHORS} ],
    onError: (error) => {
      props.notify(error.graphQLErrors[0].message, notiTypeEnum.ERROR)
    },
    update: (cache, response) => {
      cache.updateQuery([{ query: ALL_BOOKS }, {query: ALL_AUTHORS}], ({ allBooks, allAuthors }) => {
        return {
          allBooks: allBooks.concat(response.data.allBooks),
          allAuthors: allAuthors.concat(response.data.allAuthors)
        }
      })
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    const response = await addNewBook({ variables: {title, author, published: Number(published), genres} })
    if (response.data) {
      props.notify('New book added!', notiTypeEnum.SUCCESS)

      setTitle('')
      setPublished('')
      setAuthor('')
      setGenres([])
      setGenre('')
    }
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Add book</h2>
      <form onSubmit={submit}>
        <div>
          Title{' '}
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </div>
        <div>
          Author{' '}
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            required
          />
        </div>
        <div>
          Published{' '}
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
            required
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            Add genre
          </button>
        </div>
        <div>Genres: {genres.join(' ')}</div>
        <button type="submit">Create book</button>
      </form>
    </div>
  )
}

export default NewBook