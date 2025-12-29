import { GraphQLUpload } from "graphql-upload-minimal";
import { CreateTestMutation } from "../test/Mutation/CreateTestMutation";
import { UpdateTestMutation } from "../test/Mutation/UpdateTestMutation";
import { TestDetailQuery } from "../test/Query/TestDetailQuery";
import { TestListQuery } from "../test/Query/TestListQuery";
import { pokemonListQuery } from "../pokemon/Query/PokemonListQuery";
import { pokemonDetailQuery } from "../pokemon/Query/PokemonDetailQuery";
import { categoryListQuery } from "../category/Query/CategoryListQurey";
import categoryDetailQuery from "../category/Query/CategoryDetailQuery";
import { createPokemonMutation } from "../pokemon/Mutation/CreatePokemonMutation";
import DeletePokemonMutation from "../pokemon/Mutation/DeletePokemonMutation";
import { UpdatePokemonMutation } from "../pokemon/Mutation/UpdatePokemonMutation";
const AppResolver = [
  {
    Query: {
      testDetail: TestDetailQuery,
      testList: TestListQuery,

      pokemonListQuery: pokemonListQuery,
      pokemonDetailQuery: pokemonDetailQuery,

      categoryListQuery: categoryListQuery,
      categoryDetailQuery: categoryDetailQuery,
    },
    Upload: GraphQLUpload,
    Mutation: {
      createTest: CreateTestMutation,
      updateTest: UpdateTestMutation,

      createPokemon: createPokemonMutation,
      updatePokemon: UpdatePokemonMutation,
      deletePokemon: DeletePokemonMutation,
    },
  },
];

export default AppResolver;
