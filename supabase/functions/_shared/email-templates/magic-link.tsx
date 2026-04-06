/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your TLC Calisthenics login link</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>TLC CALISTHENICS</Text>
        <Hr style={divider} />
        <Heading style={h1}>Your login link</Heading>
        <Text style={text}>
          Click below to log in. This link expires shortly.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Log In
        </Button>
        <Text style={footer}>
          If you didn't request this, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Space Grotesk', Arial, sans-serif" }
const container = { padding: '24px 28px' }
const brand = { fontSize: '11px', letterSpacing: '3px', color: '#E86100', fontWeight: 'bold' as const, margin: '0 0 8px' }
const divider = { borderColor: '#E86100', margin: '0 0 24px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#141414', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#666666', lineHeight: '1.6', margin: '0 0 25px' }
const button = { backgroundColor: '#E86100', color: '#ffffff', fontSize: '14px', borderRadius: '4px', padding: '14px 24px', textDecoration: 'none', fontWeight: 'bold' as const }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
