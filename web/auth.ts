import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [
    Google({
      profile(profile) {
        return {
          ...profile,
          id: profile.sub
        }
      }
    })
  ],

  callbacks: {
    jwt({ token, profile }) {
      // console.log({token, profile })
      // if (profile) {
      //   token.id = profile.id
      //   token.image = profile.avatar_url || profile.picture
      // }
      return token
    },
    session: ({ session, token }) => {
      // if (session?.user && token?.id) {
      //   session.user.id = String(token.id)
      // }
      // console.log({ session, token });
      return session
    },
    authorized({ auth }) {
      return !!auth // this ensures there is a logged in user for -every- request
    }
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  }
})
