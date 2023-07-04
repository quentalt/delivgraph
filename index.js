const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        categories: [Category!]!
        category(id: ID!): Category
        dishes(categoryId: ID!): [Dish!]!
    }
        
    type Category {
        id: ID!
        name: String!
        dishes: [Dish!]!
    }
    
    type Dish {
        id: ID!
        name: String!
        price: Float!
        category: Category!
    }
    
    type Mutation {
        createCategory(name: String!): Category!
        updateCategory(id: ID!, name: String!): Category!
        deleteCategory(id: ID!): Category!
        createDish(name: String!, description: String, price: Float!, categoryId: ID!): Dish!
        updateDish(id: ID!, name: String, description: String, price: Float, categoryId: ID): Dish!
        deleteDish(id: ID!): Dish!     
    }
`;

const categories = [
    { id: '1', name: 'Appetizers' },
    { id: '2', name: 'Main Courses' },
    { id: '3', name: 'Desserts' },
];

let dishes = [
    { id: '1', name: 'Chicken Wings', description: 'Spicy buffalo wings', price: 9.99, categoryId: '1' },
    { id: '2', name: 'Margherita Pizza', description: 'Classic tomato and mozzarella pizza', price: 12.99, categoryId: '2' },
    { id: '3', name: 'Cheesecake', description: 'Creamy New York-style cheesecake', price: 6.99, categoryId: '3' },
];

const resolvers = {
    Query: {
        categories: () => categories,
        category: (_, { id }) => categories.find(category => category.id === id),
        dishes: (_, { categoryId }) => dishes.filter(dish => dish.categoryId === categoryId),
    },
    Mutation: {
        createCategory: (_, { name }) => {
            const newCategory = {
                id: String(categories.length + 1),
                name,
            };
            categories.push(newCategory);
            return newCategory;
        },
        updateCategory: (_, { id, name }) => {
            const index = categories.findIndex(category => category.id === id);
            if (index === -1) {
                throw new Error('Category not found');
            }
            const updatedCategory = {
                id,
                name,
            };
            categories[index] = updatedCategory;
            return updatedCategory;
        },
        deleteCategory: (_, { id }) => {
            const index = categories.findIndex(category => category.id === id);
            if (index === -1) {
                throw new Error('Category not found');
            }
            const deletedCategory = categories[index];
            categories.splice(index, 1);
            return deletedCategory;
        },
        createDish: (_, { name, description, price, categoryId }) => {
            const newDish = {
                id: String(dishes.length + 1),
                name,
                description,
                price,
                categoryId,
            };
            dishes.push(newDish);
            return newDish;
        },
        updateDish: (_, { id, name, description, price, categoryId }) => {
            const index = dishes.findIndex(dish => dish.id === id);
            if (index === -1) {
                throw new Error('Dish not found');
            }

            const updatedDish = {
                id,
                name: name || dishes[index].name,
                description: description || dishes[index].description,
                price: price || dishes[index].price,
                categoryId: categoryId || dishes[index].categoryId,
            };
            dishes[index] = updatedDish;
            return updatedDish;
        },
        deleteDish: (_, { id }) => {
            const index = dishes.findIndex(dish => dish.id === id);
            if (index === -1) {
                throw new Error('Dish not found');
            }
            const deletedDish = dishes[index];
            dishes.splice(index, 1);
            return deletedDish;
        },
    },
    Category: {
        dishes: (category) => dishes.filter(dish => dish.categoryId === category.id),
    },
    Dish: {
        category: (dish) => categories.find(category => category.id === dish.categoryId),
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

