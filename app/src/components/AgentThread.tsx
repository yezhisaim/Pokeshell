import {
  ActionBarPrimitive,
  AssistantRuntimeProvider,
  AuiConfig,
  Suggestions,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from '@assistant-ui/react'
import { MarkdownTextPrimitive } from '@assistant-ui/react-markdown'
import { useLocalRuntime, type ChatModelAdapter } from '@assistant-ui/react'
import type { ReactNode } from 'react'

import { Icon } from './ui'

/* ------------------------------------------------------------------ *
 * Agent runtime: scripted, local, no network and no API key.
 * Yields tool calls and streamed text so the thread exercises the real
 * assistant-ui rendering path end to end.
 * ------------------------------------------------------------------ */

export type AgentScript = {
  tools?: { name: string; args: Record<string, string | number | boolean>; result: string }[]
  text: string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function makeChatModel(scriptFor: (prompt: string) => AgentScript): ChatModelAdapter {
  return {
    async *run({ messages, abortSignal }) {
      const last = [...messages].reverse().find((m) => m.role === 'user')
      const prompt =
        last?.content
          .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
          .map((p) => p.text)
          .join(' ') ?? ''

      const step = scriptFor(prompt)

      for (const tool of step.tools ?? []) {
        if (abortSignal.aborted) return
        const callId = `call_${tool.name}`
        yield {
          content: [
            {
              type: 'tool-call' as const,
              toolCallId: callId,
              toolName: tool.name,
              args: tool.args,
              argsText: JSON.stringify(tool.args),
            },
          ],
        }
        await sleep(500)
        yield {
          content: [
            {
              type: 'tool-call' as const,
              toolCallId: callId,
              toolName: tool.name,
              args: tool.args,
              argsText: JSON.stringify(tool.args),
              result: tool.result,
            },
          ],
        }
        await sleep(150)
      }

      let out = ''
      for (const chunk of step.text.match(/[\s\S]{1,12}/g) ?? []) {
        if (abortSignal.aborted) return
        out += chunk
        yield { content: [{ type: 'text' as const, text: out }] }
        await sleep(14)
      }
    },
  }
}

/* ------------------------------------------------------------------ *
 * Tool UI — how Pokeshell agent actions render inside the thread
 * ------------------------------------------------------------------ */

function AgentTool({ toolName, args, result }: any) {
  const done = result !== undefined
  const argText = Object.entries(args ?? {})
    .map(([k, v]) => `${k}=${v}`)
    .join(' · ')

  return (
    <div className="agent-tool">
      <div className="agent-tool-head">
        <span className="agent-tool-ic">
          <Icon name="agent" size={13} />
        </span>
        <span className="mono agent-tool-name">{toolName}</span>
        {argText && <span className="muted mono agent-tool-args">{argText}</span>}
        <span className={`chip ${done ? 'green' : 'amber'} agent-tool-state`}>
          {done ? 'done' : 'running'}
        </span>
      </div>
      {done && <div className="muted mono agent-tool-out">{String(result)}</div>}
    </div>
  )
}

function FallbackTool(props: any) {
  return <AgentTool {...props} />
}

/* ------------------------------------------------------------------ *
 * Thread primitives
 * ------------------------------------------------------------------ */

function UserMessage() {
  return (
    <MessagePrimitive.Root className="msg msg-user">
      <div className="msg-role">You</div>
      <div className="msg-body">
        <MessagePrimitive.Parts components={{ Text: UserText }} />
      </div>
    </MessagePrimitive.Root>
  )
}

function UserText({ text }: { text: string }) {
  return <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
}

function MarkdownText() {
  return (
    <MarkdownTextPrimitive
      components={{
        p: ({ children }) => <p className="md-p">{children}</p>,
        h1: ({ children }) => <h4 className="md-h">{children}</h4>,
        h2: ({ children }) => <h4 className="md-h">{children}</h4>,
        h3: ({ children }) => <h4 className="md-h">{children}</h4>,
        ul: ({ children }) => <ul className="md-ul">{children}</ul>,
        ol: ({ children }) => <ol className="md-ol">{children}</ol>,
        li: ({ children }) => <li className="md-li">{children}</li>,
        strong: ({ children }) => <strong className="md-strong">{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        code: ({ children }) => <code className="md-code">{children}</code>,
        pre: ({ children }) => <pre className="md-pre">{children}</pre>,
        a: ({ children, href }) => (
          <a className="md-a" href={href} target="_blank" rel="noreferrer">
            {children}
          </a>
        ),
        blockquote: ({ children }) => <blockquote className="md-quote">{children}</blockquote>,
        table: ({ children }) => <table className="md-table">{children}</table>,
        th: ({ children }) => <th className="md-th">{children}</th>,
        td: ({ children }) => <td className="md-td">{children}</td>,
        hr: () => <hr className="md-hr" />,
      }}
    />
  )
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="msg msg-assistant">
      <div className="msg-role">
        <span className="msg-role-ic">
          <Icon name="agent" size={13} />
        </span>
        Pokeshell Agent
      </div>

      <div className="msg-body">
        <MessagePrimitive.Parts
          components={{ Text: MarkdownText, tools: { Fallback: FallbackTool } }}
        />

        <ActionBarPrimitive.Root className="actionbar">
          <ActionBarPrimitive.Copy className="actionbar-btn" aria-label="Copy">
            <Icon name="check" size={13} />
          </ActionBarPrimitive.Copy>
          <ActionBarPrimitive.Reload className="actionbar-btn" aria-label="Retry">
            <Icon name="chevron" size={13} />
          </ActionBarPrimitive.Reload>
        </ActionBarPrimitive.Root>
      </div>
    </MessagePrimitive.Root>
  )
}

function Composer() {
  return (
    <ComposerPrimitive.Root className="composer">
      <ComposerPrimitive.Input
        className="composer-input"
        placeholder="Ask the agent, or tell the team what to do next…"
        rows={1}
      />
      <ComposerPrimitive.Send className="composer-send" aria-label="Send">
        <Icon name="chevron" size={15} />
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  )
}

function Welcome() {
  return (
    <div className="thread-welcome">
      <div className="thread-welcome-mark">
        <Icon name="agent" size={22} />
      </div>
      <h3>Shared agent session</h3>
      <p>
        I read the same repository, plan, and running app as the rest of the team. Ask me to map
        branch overlap, draft a handoff, or check approvals.
      </p>
      <ThreadPrimitive.Suggestions data-slot="suggestions">
        {({ suggestion }) => (
          <ThreadPrimitive.Suggestion className="suggestion" prompt={suggestion.prompt}>
            {suggestion.prompt}
          </ThreadPrimitive.Suggestion>
        )}
      </ThreadPrimitive.Suggestions>
    </div>
  )
}

export function AgentThread({
  scriptFor,
  suggestions,
  children,
}: {
  scriptFor: (prompt: string) => AgentScript
  suggestions: string[]
  children?: ReactNode
}) {
  const runtime = useLocalRuntime(makeChatModel(scriptFor))
  const config = AuiConfig({ suggestions: Suggestions(suggestions) })

  return (
    <AssistantRuntimeProvider runtime={runtime} config={config}>
      <div className="aui-root thread-root">
        <ThreadPrimitive.Root className="thread">
          <ThreadPrimitive.Viewport className="thread-viewport">
            <ThreadPrimitive.If empty>
              <Welcome />
            </ThreadPrimitive.If>

            <ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage }} />
          </ThreadPrimitive.Viewport>

          <ThreadPrimitive.ViewportFooter className="thread-footer">
            <Composer />
          </ThreadPrimitive.ViewportFooter>
        </ThreadPrimitive.Root>
        {children}
      </div>
    </AssistantRuntimeProvider>
  )
}
