function App() {
  return (
    <div className="App">
      <h1>HOME PAGE</h1>

      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn >
        <UserButton />
      </SignedIn>
      
    </div>
  );
}

export default App;