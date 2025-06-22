import { Badge } from '@/shared/components/badge';
import { Card } from '@/shared/components/card';
import { LazyImage } from '@/shared/components/lazy-image';
import type { Article, Blog, Report } from '@/shared/types/news';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Globe, Rocket, Star, User, Linkedin, Twitter } from 'lucide-react';
import { memo } from 'react';

interface NewsDetailProps {
  news: Article | Blog | Report;
  onExternalLinkClick?: (url: string) => void;
}

export const NewsDetail = memo(function NewsDetail({ news, onExternalLinkClick }: NewsDetailProps) {
  const handleExternalClick = () => {
    if (onExternalLinkClick) {
      onExternalLinkClick(news.url);
    } else {
      window.open(news.url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="overflow-hidden">
        {/* 헤더 이미지 */}
        <div className="w-full h-64 md:h-80 lg:h-96 relative">
          <LazyImage src={news.image_url} alt={news.title} className="w-full h-full object-cover" />
          {news.featured && (
            <div className="absolute top-4 right-4">
              <Badge variant="destructive" className="text-sm">
                <Star className="w-3 h-3 mr-1" />
                특집
              </Badge>
            </div>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 md:p-8">
          {/* 제목 */}
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">{news.title}</h1>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>발행: {formatDate(news.published_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>{news.news_site}</span>
            </div>
            {news.updated_at !== news.published_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>수정: {formatDate(news.updated_at)}</span>
              </div>
            )}
          </div>

          {/* 요약 */}
          <div className="prose prose-gray max-w-none mb-8">
            <p className="text-lg leading-relaxed">{news.summary}</p>
          </div>

          {/* 작성자 정보 */}
          {news.authors && news.authors.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                작성자
              </h3>
              <div className="grid gap-3">
                {news.authors.map((author, index) => (
                  <Card key={`${author.name}-${index}`} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{author.name}</p>
                        {author.socials && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {author.socials.x && (
                              <motion.a
                                href={author.socials.x}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Twitter className="w-3 h-3" />
                                X
                              </motion.a>
                            )}
                            {author.socials.linkedin && (
                              <motion.a
                                href={author.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Linkedin className="w-3 h-3" />
                                LinkedIn
                              </motion.a>
                            )}
                            {author.socials.mastodon && (
                              <motion.a
                                href={author.socials.mastodon}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Globe className="w-3 h-3" />
                                Mastodon
                              </motion.a>
                            )}
                            {author.socials.bluesky && (
                              <motion.a
                                href={author.socials.bluesky}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Globe className="w-3 h-3" />
                                Bluesky
                              </motion.a>
                            )}
                            {author.socials.youtube && (
                              <motion.a
                                href={author.socials.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Globe className="w-3 h-3" />
                                YouTube
                              </motion.a>
                            )}
                            {author.socials.instagram && (
                              <motion.a
                                href={author.socials.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Globe className="w-3 h-3" />
                                Instagram
                              </motion.a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 관련 정보 */}
          {(news.launches.length > 0 || news.events.length > 0) && (
            <div className="space-y-4 mb-8">
              {news.launches.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    관련 발사 정보
                  </h3>
                  <div className="grid gap-3">
                    {news.launches.map((launch, index) => (
                      <Card key={`${launch.launch_id}-${index}`} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">발사 ID: {launch.launch_id}</p>
                            <p className="text-sm text-muted-foreground">제공: {launch.provider}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {news.events.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    관련 이벤트
                  </h3>
                  <div className="grid gap-3">
                    {news.events.map((event, index) => (
                      <Card key={`${event.event_id}-${index}`} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">이벤트 ID: {event.event_id}</p>
                            <p className="text-sm text-muted-foreground">제공: {event.provider}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 원문 링크 */}
          <div className="flex justify-center pt-6 border-t">
            <motion.button
              onClick={handleExternalClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink className="w-4 h-4" />
              원문 보러가기
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
