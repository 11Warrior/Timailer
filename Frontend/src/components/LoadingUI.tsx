import React from 'react'

const LoadingUI = () => {
    return (
        <div className="h-screen w-full bg-white z-99 ">

            <div className="max-w-7xl mx-auto my-auto px-6 py-8 pt-24">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default LoadingUI