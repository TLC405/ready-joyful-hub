/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to TLC Calisthenics — confirm your email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>TLC CALISTHENICS</Text>
        <Hr style={divider} />
        <Heading style={h1}>Welcome aboard!</Heading>
        <Text style={text}>
          Thanks for joining{' '}
          <Link href={siteUrl} style={link}><strong>TLC Calisthenics</strong></Link>.
          Confirm your email ({' '}
          <Link href={`mailto:${recipient}`} style={link}>{recipient}</Link>
          ) to start your training journey.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm &amp; Get Started
        </Button>
        <Text style={footer}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Space Grotesk', Arial, sans-serif" }
const container = { padding: '24px 28px' }
const brand = { fontSize: '11px', letterSpacing: '3px', color: '#E86100', fontWeight: 'bold' as const, margin: '0 0 8px' }
const divider = { borderColor: '#E86100', margin: '0 0 24px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#141414', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#666666', lineHeight: '1.6', margin: '0 0 25px' }
const link = { color: '#0070C0', textDecoration: 'underline' }
const button = { backgroundColor: '#E86100', color: '#ffffff', fontSize: '14px', borderRadius: '4px', padding: '14px 24px', textDecoration: 'none', fontWeight: 'bold' as const }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
