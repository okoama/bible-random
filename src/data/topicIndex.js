import { categories } from './categories.js'
import { offTheCuffTopics } from './offTheCuff.js'

export const ALL_TOPICS = categories.flatMap((c) => offTheCuffTopics[c.id])

export const TOPIC_TO_CATEGORY = new Map()
categories.forEach((c) => offTheCuffTopics[c.id].forEach((t) => TOPIC_TO_CATEGORY.set(t, c)))
