"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2 } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemName?: string
  isLoading?: boolean
}

export function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  itemName,
  isLoading = false 
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-slate-600">
            {message}
          </p>
          {itemName && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-medium text-red-800">{itemName}</p>
            </div>
          )}
          <p className="text-sm text-red-600">
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


