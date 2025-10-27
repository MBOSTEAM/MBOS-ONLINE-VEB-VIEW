import { useEffect, useRef, useCallback, useState } from 'react'

export interface WebSocketMessage {
    type: string
    data?: any
}

export interface OrderUpdate {
    order_id: string
    status: string
    timestamp: string
}

export interface QueueUpdate {
    station_id: string
    queue_length: number
    estimated_wait: number
}

export interface NotificationPush {
    id: string
    title: string
    body: string
    priority: string
}

export interface UseWebSocketOptions {
    enabled?: boolean
    onOrderUpdate?: (data: OrderUpdate) => void
    onQueueUpdate?: (data: QueueUpdate) => void
    onNotification?: (data: NotificationPush) => void
    onError?: (error: Event) => void
    channels?: string[]
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
    const {
        enabled = true,
        onOrderUpdate,
        onQueueUpdate,
        onNotification,
        onError,
        channels = ['orders', 'notifications']
    } = options

    const ws = useRef<WebSocket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const reconnectAttempts = useRef(0)

    const connect = useCallback(() => {
        if (!enabled) return

        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                console.warn('No access token found for WebSocket connection')
                return
            }

            const wsUrl = import.meta.env.VITE_WS_URL || 'ws://api.mbos.uz/ws'
            const url = `${wsUrl}?token=${token}`
            
            ws.current = new WebSocket(url)

            ws.current.onopen = () => {
                console.log('WebSocket connected')
                setIsConnected(true)
                reconnectAttempts.current = 0

                if (ws.current?.readyState === WebSocket.OPEN) {
                    ws.current.send(
                        JSON.stringify({
                            type: 'subscribe',
                            channels
                        })
                    )
                }
            }

            ws.current.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data)

                    switch (message.type) {
                        case 'order_update':
                            if (onOrderUpdate && message.data) {
                                onOrderUpdate(message.data as OrderUpdate)
                            }
                            break
                        case 'queue_update':
                            if (onQueueUpdate && message.data) {
                                onQueueUpdate(message.data as QueueUpdate)
                            }
                            break
                        case 'notification':
                            if (onNotification && message.data) {
                                onNotification(message.data as NotificationPush)
                            }
                            break
                        default:
                            console.log('Unknown WebSocket message type:', message.type)
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error)
                }
            }

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error)
                if (onError) {
                    onError(error)
                }
            }

            ws.current.onclose = () => {
                console.log('WebSocket disconnected')
                setIsConnected(false)

                if (enabled && reconnectAttempts.current < 5) {
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
                    reconnectAttempts.current++
                    
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`)
                        connect()
                    }, delay)
                }
            }
        } catch (error) {
            console.error('Error creating WebSocket:', error)
        }
    }, [enabled, channels, onOrderUpdate, onQueueUpdate, onNotification, onError])

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
        }

        if (ws.current) {
            ws.current.close()
            ws.current = null
        }
        setIsConnected(false)
    }, [])

    useEffect(() => {
        if (enabled) {
            connect()
        }

        return () => {
            disconnect()
        }
    }, [enabled, connect, disconnect])

    return {
        isConnected,
        connect,
        disconnect
    }
}

