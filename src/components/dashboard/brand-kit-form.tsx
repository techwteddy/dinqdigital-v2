'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const STORAGE_KEY = 'dinq-brand-kit'

type BrandKitState = {
  color1: string
  color2: string
  color3: string
  font1: string
  font2: string
}

const DEFAULT_BRAND: BrandKitState = {
  color1: '#0F172A',
  color2: '#3B82F6',
  color3: '#F8FAFC',
  font1: '',
  font2: '',
}

export function BrandKitForm() {
  const [brand, setBrand] = useState<BrandKitState>(DEFAULT_BRAND)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Partial<BrandKitState>
      setBrand({ ...DEFAULT_BRAND, ...parsed })
    } catch {
      // Ignore invalid localStorage payloads.
    }
  }, [])

  function update<K extends keyof BrandKitState>(key: K, value: BrandKitState[K]) {
    setSaved(false)
    setBrand((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(brand))
    setSaved(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand Colors</CardTitle>
          <CardDescription>Primary palette for your project.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {(
            [
              ['color1', 'Color 1'],
              ['color2', 'Color 2'],
              ['color3', 'Color 3'],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label htmlFor={key} className="text-sm font-medium">
                {label}
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-lg border border-border shadow-sm"
                  style={{ backgroundColor: brand[key] }}
                  aria-hidden
                />
                <Input
                  id={key}
                  value={brand[key]}
                  onChange={(event) => update(key, event.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand Fonts</CardTitle>
          <CardDescription>Typefaces used across your brand.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="font1" className="text-sm font-medium">
              Primary font
            </label>
            <Input
              id="font1"
              value={brand.font1}
              onChange={(event) => update('font1', event.target.value)}
              placeholder="e.g. Inter"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="font2" className="text-sm font-medium">
              Secondary font
            </label>
            <Input
              id="font2"
              value={brand.font2}
              onChange={(event) => update('font2', event.target.value)}
              placeholder="e.g. Georgia"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand Assets</CardTitle>
          <CardDescription>
            Logos and files live with your project deliverables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/dashboard/files">Open Your Files</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleSave}>
          Save brand kit
        </Button>
        {saved && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Saved to this browser.
          </p>
        )}
      </div>
    </div>
  )
}
