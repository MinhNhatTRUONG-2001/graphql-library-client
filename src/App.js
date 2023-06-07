import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'

import { useApolloClient, useQuery, useSubscription } from "@apollo/client"
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, CURRENT_USER } from "./GraphQLQueries"
import { notiTypeEnum } from './NotiTypeEnum'

// function that takes care of manipulating cache
export const updateCache = (cache, query, newBook) => {
  // helper that is used to eliminate saving same person twice
  const uniqueByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqueByTitle(allBooks.concat(newBook)),
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  const [notification, setNotification] = useState(null)
  const [notiType, setNotiType] = useState(null)

  const allAuthorsResult = useQuery(ALL_AUTHORS)
  const allBooksResult = useQuery(ALL_BOOKS)
  const currentUserResult = useQuery(CURRENT_USER)

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const newBook = data.data.bookAdded
      notify(`New book: ${newBook.title} by ${newBook.author.name} was added.`, notiTypeEnum.INFO)
      updateCache(client.cache, { query: ALL_BOOKS }, newBook)
    }
  })
  
  const notify = (message, type) => {
    setNotification(message)
    setNotiType(type)
    setTimeout(() => {
      setNotification(null)
      setNotiType(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.clearStore()
  }

  if (!token) {
    return (
      <div>
        <Notify notification={notification} type={notiType} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>Authors</button>
        <button onClick={() => setPage('books')}>Books</button>
        <button onClick={() => setPage('add')}>Add book</button>
        <button onClick={() => setPage('recommendations')}>Recommendations</button>
        <button onClick={logout}>Logout</button>
      </div>

      <Notify notification={notification} type={notiType}/>

      <Authors show={page === 'authors'} notify={notify} allAuthorsResult={allAuthorsResult}/>

      <Books show={page === 'books'} allBooksResult={allBooksResult}/>

      <NewBook show={page === 'add'} notify={notify} />

      <Recommendations show={page === 'recommendations'} currentUserResult={currentUserResult} allBooksResult={allBooksResult}/>
    </div>
  )
}

export default App
