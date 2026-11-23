import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import Container from '../components/ui/Container';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';
import {
  serviceCategories,
  governmentCategories,
  getCategorySubcategories,
  type Category,
  type Subcategory,
} from '../data/yamlLoader';

interface SitemapLink {
  label: string;
  to: string;
}

interface SitemapGroup extends SitemapLink {
  pages: SitemapLink[];
}

interface SitemapSection extends SitemapLink {
  groups: SitemapGroup[];
}

const linkClass =
  'text-ed-navy underline underline-offset-4 decoration-1 hover:decoration-2';

// Pages that sit outside the Services and Government sections
const portalPages: SitemapLink[] = [
  { label: 'Home', to: '/' },
  { label: 'About Better Paombong', to: '/about' },
  { label: 'Accessibility', to: '/accessibility' },
];

/** Every category in a section with the pages listed in its index. */
async function loadSection(
  label: string,
  basePath: string,
  categories: Category[]
): Promise<SitemapSection> {
  const groups = await Promise.all(
    categories.map(async category => {
      const index = await getCategorySubcategories(category.slug);
      return {
        label: category.category,
        to: `${basePath}/${category.slug}`,
        pages: index.pages.map((page: Subcategory) => ({
          label: page.name,
          to: `${basePath}/${category.slug}/${page.slug}`,
        })),
      };
    })
  );
  return { label, to: basePath, groups };
}

export default function Sitemap() {
  const [sections, setSections] = useState<SitemapSection[]>([]);

  useEffect(() => {
    Promise.all([
      loadSection('Services', '/services', serviceCategories.categories),
      loadSection('Government', '/government', governmentCategories.categories),
    ])
      .then(setSections)
      .catch(console.error);
  }, []);

  return (
    <>
      <SEO
        title="Sitemap"
        description="Every page on Better Paombong, grouped by section."
        keywords="sitemap, pages, services, government"
      />

      <section className="border-b border-ed-rule bg-ed-paper-2 py-10 md:py-14">
        <Container>
          <Breadcrumbs className="mb-8" />
          <div className="max-w-[850px]">
            <Heading>Sitemap</Heading>
            <Text size="lg" className="mb-0">
              Every page on this portal, grouped by section.
            </Text>
          </div>
        </Container>
      </section>

      <Section>
        <div className="space-y-14">
          {sections.map(section => (
            <div key={section.to}>
              <Heading level={2} className="mb-8 border-b border-ed-ink pb-4">
                <Link
                  to={section.to}
                  className="text-ed-ink no-underline hover:text-ed-navy"
                >
                  {section.label}
                </Link>
              </Heading>
              <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                {section.groups.map(group => (
                  <div key={group.to}>
                    <h3 className="font-display text-xl font-semibold text-ed-ink">
                      <Link
                        to={group.to}
                        className="text-ed-ink no-underline hover:text-ed-navy"
                      >
                        {group.label}
                      </Link>
                    </h3>
                    <ul className="mt-3 space-y-2 text-[15px] leading-relaxed">
                      {group.pages.map(page => (
                        <li key={page.to}>
                          <Link to={page.to} className={linkClass}>
                            {page.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div>
            <Heading level={2} className="mb-8 border-b border-ed-ink pb-4">
              About this portal
            </Heading>
            <ul className="space-y-2 text-[15px] leading-relaxed">
              {portalPages.map(page => (
                <li key={page.to}>
                  <Link to={page.to} className={linkClass}>
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
