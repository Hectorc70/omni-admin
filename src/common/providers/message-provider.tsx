/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
} from "react"
import ConfirmMessage from "../components/confirm-message"
import { ScreenStatus, TypeModalMessage } from "@/types/enums"

type MessageOptions = {
  title: string
  content?: React.ReactNode
  type?: TypeModalMessage
}

type MessageFn = (
  options: MessageOptions
) => Promise<void>

const MessageContext =
  createContext<MessageFn | null>(null)

export function MessageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [options, setOptions] =
    useState<MessageOptions | null>(null)

  const [resolver, setResolver] =
    useState<() => void>()

  const message: MessageFn = (options) => {
    setOptions(options)

    return new Promise((resolve) => {
      setResolver(() => resolve)
    })
  }

  const close = () => {
    resolver?.()
    setOptions(null)
  }

  return (
    <MessageContext.Provider value={message}>
      {children}

      {options && (
        <ConfirmMessage
          title={options.title}
          statusModal={ScreenStatus.success}
          typeMessageModal={options.type ?? TypeModalMessage.success}
          onCancelAction={close}
        >
          {options.content}
        </ConfirmMessage>
      )}
    </MessageContext.Provider>
  )
}

export function useMessage() {
  const context =
    useContext(MessageContext)

  if (!context) {
    throw new Error(
      "useMessage debe usarse dentro de MessageProvider"
    )
  }

  return context
}
