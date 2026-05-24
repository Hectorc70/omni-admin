import {
  createContext,
  useContext,
  useState,
} from "react"
import ConfirmMessage from "../components/confirm-message"
import { ScreenStatus } from "@/types/enums"

type ConfirmOptions = {
  title: string
  content?: React.ReactNode
}

type ConfirmFn = (
  options: ConfirmOptions
) => Promise<boolean>

const ConfirmContext =
  createContext<ConfirmFn | null>(null)

export function ConfirmProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [options, setOptions] =
    useState<ConfirmOptions | null>(null)

  const [resolver, setResolver] =
    useState<(value: boolean) => void>()

  const confirm: ConfirmFn = (options) => {
    setOptions(options)

    return new Promise((resolve) => {
      setResolver(() => resolve)
    })
  }

  const close = (result: boolean) => {
    resolver?.(result)
    setOptions(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {options && (
        <ConfirmMessage
          title={options.title}
          statusModal={ScreenStatus.success}
          onCancelAction={() => close(false)}
          onConfirmAction={() => close(true)}
        >
          {options.content}
        </ConfirmMessage>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context =
    useContext(ConfirmContext)

  if (!context) {
    throw new Error(
      "useConfirm debe usarse dentro de ConfirmProvider"
    )
  }

  return context
}