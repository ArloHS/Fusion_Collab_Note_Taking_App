import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes: Array<Note>;
};

export type File = {
  __typename?: 'File';
  encoding: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  mimetype: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: Category;
  createNote?: Maybe<Note>;
  createToken: AuthPayload;
  /**  Returns true iff successful */
  deleteCategory: Scalars['Boolean']['output'];
  /**  Returns true iff successful */
  deleteNote?: Maybe<Scalars['Boolean']['output']>;
  /**  Returns true iff successful */
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  signup: AuthPayload;
  updateCategory: Category;
  updateNote?: Maybe<Note>;
  updateUser: User;
  updateUserSecure?: Maybe<User>;
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateNoteArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};


export type MutationCreateTokenArgs = {
  emailOrUsername: Scalars['String']['input'];
  password: Scalars['String']['input'];
  remember?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNoteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  password: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  avatar?: InputMaybe<Scalars['Upload']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateNoteArgs = {
  collaborators?: InputMaybe<Array<Scalars['ID']['input']>>;
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateUserArgs = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateUserSecureArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  originalPassword: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
};

export type Note = {
  __typename?: 'Note';
  collaborators: Array<User>;
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastUpdated: Scalars['String']['output'];
  owner: User;
  title: Scalars['String']['output'];
};

export type NoteUpdate = {
  __typename?: 'NoteUpdate';
  content?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type NotesList = {
  __typename?: 'NotesList';
  ownedNotes: Array<Note>;
  sharedWithUser: Array<Note>;
};

export type Query = {
  __typename?: 'Query';
  getCurrentUser?: Maybe<User>;
  getHello: Scalars['String']['output'];
  /** Get a specific note */
  getNote?: Maybe<Note>;
  getUserByEmailOrUsername?: Maybe<User>;
  getUserById?: Maybe<User>;
  getUserCategories: Array<Category>;
  /** Get all notes visible to the authorized user */
  getUserNotes: Array<Note>;
};


export type QueryGetNoteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserByEmailOrUsernameArgs = {
  emailOrUsername: Scalars['String']['input'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  noteUpdated: NoteUpdate;
};


export type SubscriptionNoteUpdatedArgs = {
  noteId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Category: ResolverTypeWrapper<Category>;
  File: ResolverTypeWrapper<File>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Note: ResolverTypeWrapper<Note>;
  NoteUpdate: ResolverTypeWrapper<NoteUpdate>;
  NotesList: ResolverTypeWrapper<NotesList>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthPayload: AuthPayload;
  Boolean: Scalars['Boolean']['output'];
  Category: Category;
  File: File;
  ID: Scalars['ID']['output'];
  Mutation: {};
  Note: Note;
  NoteUpdate: NoteUpdate;
  NotesList: NotesList;
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  Upload: Scalars['Upload']['output'];
  User: User;
};

export type AuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileResolvers<ContextType = any, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = {
  encoding?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimetype?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'name'>>;
  createNote?: Resolver<Maybe<ResolversTypes['Note']>, ParentType, ContextType, RequireFields<MutationCreateNoteArgs, 'title'>>;
  createToken?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationCreateTokenArgs, 'emailOrUsername' | 'password'>>;
  deleteCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteNote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteNoteArgs, 'id'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'password'>>;
  signup?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'email' | 'firstName' | 'lastName' | 'password' | 'username'>>;
  updateCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, 'id' | 'name'>>;
  updateNote?: Resolver<Maybe<ResolversTypes['Note']>, ParentType, ContextType, RequireFields<MutationUpdateNoteArgs, 'id'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, Partial<MutationUpdateUserArgs>>;
  updateUserSecure?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserSecureArgs, 'originalPassword'>>;
};

export type NoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = {
  collaborators?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastUpdated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NoteUpdateResolvers<ContextType = any, ParentType extends ResolversParentTypes['NoteUpdate'] = ResolversParentTypes['NoteUpdate']> = {
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotesListResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotesList'] = ResolversParentTypes['NotesList']> = {
  ownedNotes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
  sharedWithUser?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getCurrentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  getHello?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  getNote?: Resolver<Maybe<ResolversTypes['Note']>, ParentType, ContextType, RequireFields<QueryGetNoteArgs, 'id'>>;
  getUserByEmailOrUsername?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByEmailOrUsernameArgs, 'emailOrUsername'>>;
  getUserById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByIdArgs, 'id'>>;
  getUserCategories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  getUserNotes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  noteUpdated?: SubscriptionResolver<ResolversTypes['NoteUpdate'], "noteUpdated", ParentType, ContextType, RequireFields<SubscriptionNoteUpdatedArgs, 'noteId'>>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  NoteUpdate?: NoteUpdateResolvers<ContextType>;
  NotesList?: NotesListResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
};

