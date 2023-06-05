import { useMutation } from "@apollo/client"
import { useState } from "react"
import { EDIT_AUTHOR_BIRTHYEAR } from "../GraphQLQueries"
import { notiTypeEnum } from "../NotiTypeEnum"

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ editAuthorBirthyear ] = useMutation(EDIT_AUTHOR_BIRTHYEAR, {
    onError: (error) => {
      props.notify(error.graphQLErrors[0].message, notiTypeEnum.ERROR)
    }
  })

  if (!props.show) {
    return null
  }

  var authors = null
  if (props.allAuthorsResult.loading) {
    return <div>Loading...</div>
  }
  else {
    authors = props.allAuthorsResult.data.allAuthors
  }

  const submit = (event) => {
    event.preventDefault()

    editAuthorBirthyear({ variables: {name, born: Number(born)} })

    setName('')
    setBorn('')
  }
  
  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Edit author's birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            Name{' '}
            <select value={name} onChange={({ target }) => setName(target.value)}>
              <option value=''>Select an author...</option>
              {authors.map(a => <option value={a.name}>{a.name}</option> )}
            </select>
          </label>
        </div>
        <div>
          Born{' '}
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  )
}

export default Authors
