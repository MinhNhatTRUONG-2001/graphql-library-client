const Recommendations = (props) => {
    if (!props.show) {
        return null
    }

    var booksByFavoriteGenre = null, books = null, favoriteGenre = null
    if (props.currentUserResult.loading || props.allBooksResult.loading) {
        return <div>Loading...</div>
    }
    else {
        books = props.allBooksResult.data.allBooks
        favoriteGenre = props.currentUserResult.data.me.favoriteGenre
        booksByFavoriteGenre = books.filter(b => b.genres.includes(favoriteGenre))
    }

    return (
        <div>
          <h2>Recommendations</h2>
          <p>Books in your favorite genre: <b>{favoriteGenre}</b></p>
    
          <table>
            <tbody>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Published</th>
              </tr>
              {booksByFavoriteGenre.map((a) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
}

export default Recommendations