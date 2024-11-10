// src/app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Home() {
    const router = useRouter();

    const handlePlay = () => {
        router.push('/gameplay'); // Navega para a página do jogo
    };

    const handleSettings = () => {
        router.push('/settings'); // Navega para a página de configurações
    };

    const handleHowToPlay = () => {
        router.push('/how_to_play'); // Navega para a página de como jogar
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-slate-900 text-slate-50 pt-4">
            <Card className="w-full max-w-2xl bg-slate-900 p-0 m-0">
                <CardHeader>
                    <CardTitle className="text-center text-3xl mb-4 text-slate-50">
                        Conti GO
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    <Button className="border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-slate-900" variant="outline" onClick={handlePlay}>
                        Jogar
                    </Button>
                    <Button className="border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-slate-900" variant="outline" onClick={handleSettings}>
                        Configurações
                    </Button>
                    <Button className="border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-slate-900" variant="outline" onClick={handleHowToPlay}>
                        Como Jogar
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
