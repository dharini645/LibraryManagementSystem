# Library Management System

class Library:
    def __init__(self):
        self.books = {}        # {book_id: {"title": ..., "author": ..., "available": True/False}}
        self.members = {}      # {member_id: {"name": ..., "borrowed": []}}

    def add_book(self, book_id, title, author):
        if book_id in self.books:
            print("❌ Book ID already exists.")
        else:
            self.books[book_id] = {"title": title, "author": author, "available": True}
            print(f"✅ Book '{title}' added successfully.")

    def display_books(self):
        if not self.books:
            print("📭 No books in the library.")
        else:
            print("\n📚 Available Books:")
            for book_id, details in self.books.items():
                status = "Available ✅" if details["available"] else "Borrowed ❌"
                print(f"ID: {book_id} | Title: {details['title']} | Author: {details['author']} | {status}")

    def register_member(self, member_id, name):
        if member_id in self.members:
            print("❌ Member ID already exists.")
        else:
            self.members[member_id] = {"name": name, "borrowed": []}
            print(f"✅ Member '{name}' registered successfully.")

    def borrow_book(self, member_id, book_id):
        if member_id not in self.members:
            print("❌ Member not found.")
            return
        if book_id not in self.books:
            print("❌ Book not found.")
            return
        if not self.books[book_id]["available"]:
            print("❌ Book is already borrowed.")
            return

        self.books[book_id]["available"] = False
        self.members[member_id]["borrowed"].append(book_id)
        print(f"📖 {self.members[member_id]['name']} borrowed '{self.books[book_id]['title']}'")

    def return_book(self, member_id, book_id):
        if member_id not in self.members or book_id not in self.books:
            print("❌ Invalid member or book.")
            return
        if book_id not in self.members[member_id]["borrowed"]:
            print("❌ This member didn’t borrow the book.")
            return

        self.books[book_id]["available"] = True
        self.members[member_id]["borrowed"].remove(book_id)
        print(f"🔄 '{self.books[book_id]['title']}' returned successfully.")

def main():
    library = Library()

    while True:
        print("\n====== Library Management System ======")
        print("1. Add Book")
        print("2. Display Books")
        print("3. Register Member")
        print("4. Borrow Book")
        print("5. Return Book")
        print("6. Exit")

        choice = input("Enter your choice: ")

        if choice == "1":
            book_id = input("Enter Book ID: ")
            title = input("Enter Book Title: ")
            author = input("Enter Author Name: ")
            library.add_book(book_id, title, author)

        elif choice == "2":
            library.display_books()

        elif choice == "3":
            member_id = input("Enter Member ID: ")
            name = input("Enter Member Name: ")
            library.register_member(member_id, name)

        elif choice == "4":
            member_id = input("Enter Member ID: ")
            book_id = input("Enter Book ID: ")
            library.borrow_book(member_id, book_id)

        elif choice == "5":
            member_id = input("Enter Member ID: ")
            book_id = input("Enter Book ID: ")
            library.return_book(member_id, book_id)

        elif choice == "6":
            print("👋 Exiting Library System. Goodbye!")
            break

        else:
            print("❌ Invalid choice, try again.")

if __name__ == "__main__":
    main()
