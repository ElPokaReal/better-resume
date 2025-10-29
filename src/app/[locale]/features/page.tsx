'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Save, Globe, Palette, Layout, FileDown, Smartphone, Moon, Share2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export default function FeaturesPage() {
  const t = useTranslations('landing.featuresPage');
  const containerRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get a stable reference to detect language changes
  const featuresKey = t('list.editor.title');

  // Master GSAP ScrollTrigger setup
  useEffect(() => {
    // Reset all animations on mount/language change
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Reset all detail panels to initial state
    detailRefs.current.forEach((ref, index) => {
      if (!ref) return;
      gsap.set(ref, {
        opacity: index === 0 ? 1 : 0,
        visibility: index === 0 ? 'visible' : 'hidden',
        y: 0,
        scale: 1,
        zIndex: index === 0 ? 10 : 1,
        pointerEvents: index === 0 ? 'auto' : 'none',
      });
      
      // Reset children
      const children = ref.querySelectorAll('.detail-icon, .detail-title, .detail-description');
      gsap.set(children, {
        opacity: index === 0 ? 1 : 0,
        y: 0,
      });
    });
    
    // Reset all buttons to initial state
    buttonRefs.current.forEach((btn, index) => {
      if (!btn) return;
      const icon = btn.querySelector('.feature-icon');
      const dot = btn.querySelector('.feature-dot');
      
      gsap.set(btn, {
        borderColor: index === 0 ? 'currentColor' : 'rgba(0, 0, 0, 0.1)',
        backgroundColor: index === 0 ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
      });
      
      if (icon) {
        gsap.set(icon, { scale: index === 0 ? 1.1 : 1 });
      }
      
      if (dot) {
        gsap.set(dot, {
          scale: index === 0 ? 1 : 0.75,
          backgroundColor: index === 0 ? '#3b82f6' : '#d1d5db',
        });
      }
    });
    
    let currentIndex = 0;
    let ticking = false;
    
    const ctx = gsap.context(() => {
      // Throttled function to find and activate closest feature
      const updateActiveFeature = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const viewportCenter = scrollY + viewportHeight / 2;
            
            let newIndex = 0;
            let minDistance = Infinity;

            // Find the feature closest to viewport center
            featureRefs.current.forEach((ref, index) => {
              if (!ref) return;
              
              const rect = ref.getBoundingClientRect();
              const elementTop = rect.top + scrollY;
              const elementCenter = elementTop + rect.height / 2;
              
              // Calculate distance from viewport center
              const distance = Math.abs(elementCenter - viewportCenter);
              
              if (distance < minDistance) {
                minDistance = distance;
                newIndex = index;
              }
            });

            // Edge cases: force first/last at page boundaries
            const scrollTop = scrollY;
            const scrollHeight = document.documentElement.scrollHeight;
            const atTop = scrollTop < 50;
            const atBottom = scrollTop + viewportHeight >= scrollHeight - 50;

            if (atTop) {
              newIndex = 0;
            } else if (atBottom) {
              newIndex = featureRefs.current.length - 1;
            }

            // Only update if changed
            if (newIndex !== currentIndex) {
              currentIndex = newIndex;
              activateFeature(newIndex);
            }

            ticking = false;
          });
          ticking = true;
        }
      };

      // Create individual ScrollTriggers for each feature
      featureRefs.current.forEach((ref, index) => {
        if (!ref) return;

        ScrollTrigger.create({
          trigger: ref,
          start: 'top center+=20%',
          end: 'bottom center-=20%',
          onEnter: () => {
            if (currentIndex !== index) {
              currentIndex = index;
              activateFeature(index);
            }
          },
          onEnterBack: () => {
            if (currentIndex !== index) {
              currentIndex = index;
              activateFeature(index);
            }
          },
          // markers: { name: `feature-${index}` }, // Debug
        });
      });

      // Also listen to scroll for edge cases
      const handleScroll = () => {
        updateActiveFeature();
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      // Cleanup
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };

      // Activate feature function with GSAP animations
      function activateFeature(activeIndex: number) {
          // Animate all buttons
          buttonRefs.current.forEach((btn, btnIndex) => {
            if (!btn) return;
            
            const icon = btn.querySelector('.feature-icon');
            const dot = btn.querySelector('.feature-dot');
            
            if (btnIndex === activeIndex) {
              // Active button
              gsap.to(btn, {
                borderColor: 'currentColor',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                duration: 0.3,
                ease: 'power1.out',
                overwrite: true,
              });

              if (icon) {
                gsap.to(icon, {
                  scale: 1.1,
                  duration: 0.4,
                  ease: 'back.out(1.4)',
                  overwrite: true,
                });
              }

              if (dot) {
                gsap.to(dot, {
                  scale: 1,
                  backgroundColor: '#3b82f6',
                  duration: 0.3,
                  ease: 'power1.out',
                  overwrite: true,
                });
              }
            } else {
              // Inactive button
              gsap.to(btn, {
                borderColor: 'rgba(0, 0, 0, 0.1)',
                backgroundColor: 'transparent',
                duration: 0.3,
                ease: 'power1.out',
                overwrite: true,
              });

              if (icon) {
                gsap.to(icon, {
                  scale: 1,
                  duration: 0.3,
                  ease: 'power1.out',
                  overwrite: true,
                });
              }

              if (dot) {
                gsap.to(dot, {
                  scale: 0.75,
                  backgroundColor: '#d1d5db',
                  duration: 0.3,
                  ease: 'power1.out',
                  overwrite: true,
                });
              }
            }
          });

          // Create timeline for sequential detail panel animation
          const tl = gsap.timeline();
          
          // Step 1: Hide all inactive panels immediately
          detailRefs.current.forEach((detailRef, detailIndex) => {
            if (!detailRef || detailIndex === activeIndex) return;
            
            tl.set(detailRef, {
              opacity: 0,
              visibility: 'hidden',
              zIndex: 1,
              pointerEvents: 'none',
            }, 0);
          });

          // Step 2: Show active panel
          const activeDetail = detailRefs.current[activeIndex];
          if (activeDetail) {
            // Set visibility, z-index and pointer events immediately
            tl.set(activeDetail, {
              visibility: 'visible',
              zIndex: 10,
              pointerEvents: 'auto',
            }, 0);

            // Fade in the panel
            tl.to(activeDetail, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
            }, 0.05);

            // Animate children with stagger
            const children = activeDetail.querySelectorAll('.detail-icon, .detail-title, .detail-description');
            tl.fromTo(children,
              {
                opacity: 0,
                y: 15,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.35,
                stagger: 0.05,
                ease: 'power2.out',
              },
              0.15
            );
          }
      }

      // Initial state - activate first feature
      activateFeature(0);

      // Entrance animations for the whole section
      if (containerRef.current) {
        gsap.from('.feature-item', {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom-=100',
            once: true,
          },
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [featuresKey]); // Re-run when language changes

  // Click handler with GSAP scroll
  const handleFeatureClick = (index: number) => {
    const element = featureRefs.current[index];
    if (element) {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: {
          y: element,
          offsetY: window.innerHeight / 2 - element.offsetHeight / 2,
        },
        ease: 'power3.inOut',
      });
    }
  };
  
  const features = [
    {
      icon: FileText,
      title: t('list.editor.title'),
      description: t('list.editor.description'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Save,
      title: t('list.autosave.title'),
      description: t('list.autosave.description'),
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Globe,
      title: t('list.multilingual.title'),
      description: t('list.multilingual.description'),
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Palette,
      title: t('list.customization.title'),
      description: t('list.customization.description'),
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Layout,
      title: t('list.sections.title'),
      description: t('list.sections.description'),
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: FileDown,
      title: t('list.export.title'),
      description: t('list.export.description'),
      color: 'from-teal-500 to-green-500',
    },
    {
      icon: Smartphone,
      title: t('list.responsive.title'),
      description: t('list.responsive.description'),
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Moon,
      title: t('list.darkMode.title'),
      description: t('list.darkMode.description'),
      color: 'from-gray-600 to-gray-800',
    },
    {
      icon: Share2,
      title: t('list.sharing.title'),
      description: t('list.sharing.description'),
      color: 'from-blue-600 to-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="group-hover:scale-110 transition-transform">
                <Logo size={28} />
              </div>
              <span className="text-base font-medium">Better Resume</span>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('cta')}
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl sm:text-6xl font-medium mb-6 tracking-tight">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Features Grid - Split View */}
          <div ref={containerRef} className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Left Side - Feature List */}
            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                
                return (
                  <div
                    key={index}
                    ref={(el) => {
                      featureRefs.current[index] = el;
                    }}
                    className="feature-item"
                  >
                    <button
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      onClick={() => handleFeatureClick(index)}
                      className="w-full text-left p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`feature-icon bg-gradient-to-br ${feature.color} rounded-xl p-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {feature.title}
                          </h3>
                        </div>
                        <div className="feature-dot w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Right Side - Feature Detail */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black border-2 border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl relative overflow-hidden" style={{ minHeight: '400px' }}>
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isFirst = index === 0;
                  
                  return (
                    <div
                      key={`feature-detail-${index}`}
                      ref={(el) => {
                        detailRefs.current[index] = el;
                      }}
                      className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center"
                      style={{ 
                        opacity: isFirst ? 1 : 0,
                        visibility: isFirst ? 'visible' : 'hidden',
                        pointerEvents: isFirst ? 'auto' : 'none',
                        zIndex: isFirst ? 10 : 1,
                      }}
                    >
                      <div 
                        className={`detail-icon inline-flex bg-gradient-to-br ${feature.color} rounded-2xl p-4 mb-6 w-fit`}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h2 
                        className="detail-title text-3xl font-semibold text-gray-900 dark:text-white mb-4"
                      >
                        {feature.title}
                      </h2>
                      <p 
                        className="detail-description text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
                      >
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-12">
            <h2 className="text-3xl font-medium mb-4">
              {t('cta')}
            </h2>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
