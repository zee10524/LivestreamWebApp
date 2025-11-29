import React from 'react';
import { Navbar } from "./_components/navbar";
import { Sidebar } from './_components/sidebar';
import { Container } from './_components/container';

interface BrowseLayoutProps {
    children: React.ReactNode;
}

const BrowseLayout = ({ children }: BrowseLayoutProps): React.ReactElement => {
    return (
        <>
            <Navbar />
            <div className="flex h-full pt-20">
                <Sidebar />
                
                <Container>
                    {children}
                </Container>
            </div>
        </>
    );
};

export default BrowseLayout;
