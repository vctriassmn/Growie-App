//[id].js
// File: growiie kirim/app/(tabs)/ArticleComponents/[id].js

import React from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ArticleDetail from './ArticleDetail';
import { initialData } from '../Article';
import { useJournalAndArticle } from '../../../context/JournalAndArticleStore';

export default function ArticleDetailsPage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { publishedArticles = [], likedArticles = new Set(), toggleLike } = useJournalAndArticle();

    // Menggabungkan data awal dengan data yang dipublikasikan dari context
    const allArticles = [...initialData, ...publishedArticles];

    // Mencari artikel berdasarkan ID dari params
    const article = allArticles.find(item => item.id === id);

    if (!article) {
        return <Text>Article not found!</Text>;
    }

    const handleBack = () => {
        router.push('/(tabs)/Article');
    };

    return (
        <ArticleDetail
            plant={article}
            isLiked={likedArticles.has(article.id)}
            toggleLike={toggleLike}
            onBack={handleBack}
        />
    );
}