const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.genre && !args.author) return Book.find({});

      if (!args.genre) {
        const author = await Author.findOne({ name: args.author });
        if (!author) return [];
        return Book.find({ author: author._id });
      } else if (!args.author) {
        return Book.find({ genres: { $all: [args.genre] } });
      } else {
        const authorSent = await Author.findOne({ name: args.author });
        if (!authorSent) return [];
        return Book.find({
          author: authorSent._id,
          genres: { $all: [args.genre] },
        });
      }
    },
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => {
      console.log(context);
      return context.currentUser;
    },
  },

  Book: {
    author: async (root) => {
      const author = await Author.findById(root.author);
      if (!author) throw new Error("Author not found");
      return author;
    },
  },

  Author: {
    bookCount: async (root) => {
      const count = await Book.collection.countDocuments({ author: root._id });
      return count;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("Not Authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          });
        }
      }
      const newBook = new Book({ ...args, author: author._id });
      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: newBook });

      return newBook;
    },

    editAuthor: async (root, args) => {
      const authorToEdit = await Author.findOne({ name: args.name });
      if (!authorToEdit) return null;
      authorToEdit.born = args.setBornTo;
      return authorToEdit.save();
    },

    createUser: async (root, args) => {
      const user = new User({ ...args });

      return await user.save().catch((error) => {
        throw new GraphQLError("Creating user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userToken, process.env.SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
