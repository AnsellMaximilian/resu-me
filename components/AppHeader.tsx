import { Models } from "appwrite";

export default function AppHeader({
  currentAccount,
}: {
  currentAccount: Models.User<Models.Preferences>;
}) {
  return (
    <header>
      <nav>
        <div>{currentAccount.name}</div>
      </nav>
    </header>
  );
}
